import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ControllerDataset } from './SaveData'
import MobileNav from '../nav/MobileNav'
import * as tf from '@tensorflow/tfjs';


const createUrl = 'http://packr-database.herokuapp.com/items'
class CreateItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageSrc: 0,
            warning: null,
            tfLoaded: false,
            mouseDown: false,
            imgCount: 0,
            exampleCount: 0,
            predictCount: 0,
            lossThreshold: false,
            isTraining: false,
        }
    }



    componentDidMount() {
        this.setup()
            .then(res => {
                console.log('res from setup', res)
                this.setState({ imageSrc: this.props.itemId })
                return res
            })
            .then(() => {
                let mobilenet = tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
                return mobilenet
            })
            .then(mobilenet => {
                let layer = mobilenet.getLayer('conv_pw_13_relu')
                this.preTrained = tf.model({ inputs: mobilenet.inputs, outputs: layer.output })
                this.saveData = new ControllerDataset(50)
                // let loadingPackr = tf.loadModel('indexeddb://packr-model')
                // return loadingPackr
                return this.preTrained
            })
            // .then(() => {
            //     let loadingPackr = tf.loadModel('indexeddb://packr-model')
            //     return loadingPackr
            // })
            .then(loadingPackr => {
                // this.loadedPacker = loadingPackr
                this.model = this.model
                this.setState({ tfLoaded: true })
                return this.model
            })
            .catch(err => console.error('componentDidMount err:', err))

    }

    setTrainingMode = () => this.setState({isTraining: !this.state.isTraining})


    train = async () => {
        this.setTrainingMode()
        if (this.saveData.xs == null) {
            throw new Error('Add some examples before training!');
        }
        const denseUnits = 100
        const totalNumItemsInDb = 50
        const learningRate = 0.0001
        const epochs = 20
        const batchSizeFraction = 0.4
        this.model = tf.sequential({
            layers: [
                // Flattens the input to a vector so we can use it in a dense layer. While
                // technically a layer, this only performs a reshape (and has no training
                // parameters).
                tf.layers.flatten({
                    // inputShape: this.loadedPacker.outputs[0].shape.slice(1)
                    inputShape: this.preTrained.outputs[0].shape.slice(1)
                }),
                // Layer 1.
                tf.layers.dense({
                    units: denseUnits,
                    activation: 'relu',
                    kernelInitializer: 'varianceScaling',
                    useBias: true
                }),
                // Layer 2. The number of units of the last layer should correspond
                // to the number of classes we want to predict.
                tf.layers.dense({
                    units: totalNumItemsInDb,
                    kernelInitializer: 'varianceScaling',
                    useBias: false,
                    activation: 'softmax'
                })
            ]
        });
        // Creates the optimizers which drives training of the model.
        const optimizer = tf.train.adam(learningRate);
        // We use categoricalCrossentropy which is the loss function we use for
        // categorical classification which measures the error between our predicted
        // probability distribution over classes (probability that an input is of each
        // class), versus the label (100% probability in the true class)>
        this.model.compile({ optimizer: optimizer, loss: 'categoricalCrossentropy', metrics: ['accuracy']});
        // We parameterize batch size as a fraction of the entire dataset because the
        // number of examples that are collected depends on how many examples the user
        // collects. This allows us to have a flexible batch size.
        const batchSize =
            Math.floor(this.saveData.xs.shape[0] * batchSizeFraction)
        if (!(batchSize > 0)) {
            throw new Error(
                `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
        }
        var counter = 0
        // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
        this.model.fit(this.saveData.xs, this.saveData.ys, {
            batchSize,
            epochs: epochs,
            callbacks: {
                onBatchEnd: async (batch, logs) => {
                    console.log('Loss: ' + logs.loss.toFixed(6), 'batch', batch);
                    if(counter >=50) this.setState({lossThreshold: true})
                    counter++
                }
            }
        })
    }


    getExamples = () => {
        const label = this.state.imageSrc
        var startGetting = setInterval(() => {
            // console.log('pretrained:', this.preTrained.outputs[0].shape.slice(1), 'packr', this.loadedPacker.outputs[0].shape.slice(1))
            const img = this.capture()
            const embeddings = this.preTrained.predict(img)
            // const example = this.loadedPacker.predict(embeddings)
            tf.tidy(() => this.saveData.addExample(embeddings, label))
            // tf.tidy(() => this.saveData.addExample(example, label))
            let addToCount = this.state.exampleCount
            this.setState({ exampleCount: addToCount + 1 })
            if (this.state.exampleCount === 20) {
                clearInterval(startGetting)
                console.log('label', label)
                this.train()
            }
        }, 300)
    }

    predictTheImage = () => {
        var startPredicting = setInterval(async () => {
            try {
                const predictedClass = tf.tidy(() => {
                    const img = this.capture()
                    const embeddings = this.preTrained.predict(img)
                    const predictions = this.model.predict(embeddings)
                    return predictions.as1D().argMax()
                })
                const classId = (await predictedClass.data())[0]
                console.log('predictedClassId:', classId)
                predictedClass.dispose()
                await tf.nextFrame()
                this.setState({ predictCount: this.state.predictCount + 1 })
                if (this.state.predictCount === 50) {
                    clearInterval(startPredicting)
                }
            } catch (err) {
                console.warn('Catch', err)
            }   
        }, 300)
    }

    saveModel = () => {
        this.model.save('indexeddb://packr-model')
        .then(res => {
            console.log('packr model saved, response:',res)
            return res
        })
        .catch(err => console.warn('model save error:', err))
    }

    capture = () => {
        return tf.tidy(() => {
            // Reads the image as a Tensor from the webcam <video> element.
            const webcamImage = tf.fromPixels(this.refs.preview);
            // Crop the image so we're using the center square of the rectangular
            // webcam.
            const croppedImage = this.cropImage(webcamImage);
            // Expand the outer most dimension so we have a batch size of 1.
            const batchedImage = croppedImage.expandDims(0);
            // Normalize the image between -1 and 1. The image comes in between 0-255,
            // so we divide by 127 and subtract 1.
            return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
        });
    }

    cropImage = (img) => {
        const size = Math.min(img.shape[0], img.shape[1]);
        const centerHeight = img.shape[0] / 2;
        const beginHeight = centerHeight - (size / 2);
        const centerWidth = img.shape[1] / 2;
        const beginWidth = centerWidth - (size / 2);
        return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
    }

    adjustVideoSize = (width, height) => {
        const aspectRatio = width / height;
        if (width >= height) {
            this.refs.preview.width = aspectRatio * this.refs.preview.height;
        } else if (width < height) {
            this.refs.preview.height = this.refs.preview.width / aspectRatio;
        }
    }

    setup = () => {
        return new Promise((resolve, reject) => {
            const navigatorAny = navigator;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
                navigatorAny.msGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia(
                    { video: true },
                    stream => {
                        this.refs.preview.srcObject = stream;
                        this.refs.preview.addEventListener('loadeddata', async () => {
                            this.adjustVideoSize(
                                this.refs.preview.videoWidth,
                                this.refs.preview.videoHeight);
                            resolve();
                        }, false);
                    },
                    error => {
                        reject();
                    });
            } else {
                reject();
            }
        });
    }

    // atch Error: Error when checking : expected flatten_Flatten1_input to have shape [null,7,7,256] but got array with shape [1,224,224,3].


    getItemName = (e) => this.setState({ itemName: e.target.value })

    sendItem = () => {
        console.log(JSON.stringify(this.state.imageSrc[0]))
        fetch(createUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                'name': this.state.itemName,
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    this.setState({ warning: 'warning' })
                    return res
                } else {
                    this.setState({ warning: 'success', itemId: res.item.id })
                    return res
                }
            })
            .catch(err => console.warn(err))
    }

    render() {
        const { warning, tfLoaded, predictCount, lossThreshold, exampleCount, isTraining } = this.state
        const { itemId, itemName } = this.props
        return (
            <div>
                <div>
                    <MobileNav signOut={this.props.signOut} />
                </div>
                <Header as='h1' style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}>Center {itemName ? itemName : `Item`} in view</Header>
                <video id='preview' ref="preview" width="360" height="224" autoPlay muted playsInline></video>
                {tfLoaded && itemId ? <p style={{ color: 'white' }}></p> : <Loader size='mini' active>Loading..</Loader>}
                <Divider />
                <Form className={warning} onSubmit={() => console.log('submit')}>
                    <Message success header='Item Added!' content={`I now know what your ${this.state.itemName} looks like!`} />
                    <Message
                        warning
                        header='Could you check something!'
                        list={[
                            'The Items may not have been created correctly.',
                        ]}
                    />
                    <div>
                                <div>
                                    {tfLoaded &&  exampleCount === 20 ? '':<button style={{ width: '170px' }} className='add-button create' onClick={this.getExamples} ><Icon name='camera' /><span className='no-copy'>Scan {itemName}</span></button>}
                                    <div>
                                    {lossThreshold ? '' :
                                    <div>{exampleCount === 20 ? <div style={{ width: '200px', backgroundColor: 'olive', marginLeft: '27vw', color: 'white', height: '40px', padding: '10px', borderRadius: '25px' }} onClick={this.train} ><i className="fas fa-brain" style={{ color: 'white', marginRight: '7px' }}>  </i>Learning about {itemName}...</div>:''}</div>
                                    }
                                    </div>
                                    {/* {lossThreshold  ? <button style={{ width: '170px', backgroundColor: 'red' }} className='add-button create' onClick={()=>console.log(this.model.summary())} ><Icon name='stop circle outline' /><span className='no-copy'>log the summary of packr</span></button>:''} */}
                                </div>
                    </div>
                </Form>
                <h2 style={{ color: 'white' }}>{`${exampleCount} Examples..`}</h2>
                {lossThreshold ? <div><h2 style={{ color: 'white' }}>I know what {itemName} looks like!</h2><Link to='/add-items'><button style={{ width: '170px' }} className='add-button create' onClick={()=>console.log('go')} ><Icon name='plus'/> Add {itemName} to a backpack.</button></Link></div>: ''}
            </div>
        )
    }
}

export default CreateItem

// {lossThreshold ? <button style={{ width: '170px' }} className='add-button create' onClick={this.saveModel} ><Icon name='plus'/> Add {itemName} to a Pack!</button>: ''}

// to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=1076, weightSpecsBytes=197, weightDataBytes=5023600.
// {modelArtifactsInfo: {…}}
// modelArtifactsInfo:
// dateSaved: Tue Jan 15 2019 12:28:26 GMT-0700 (Mountain Standard Time) {}
// modelTopologyBytes: 1076
// modelTopologyType: "JSON"
// weightDataBytes: 5023600
// weightSpecsBytes: 197
// __proto__: Object
// __proto__: Object

// {modelArtifactsInfo: {…}}
// modelArtifactsInfo:
// dateSaved: Tue Jan 15 2019 12:43:37 GMT-0700 (Mountain Standard Time) {}
// modelTopologyBytes: 1076
// modelTopologyType: "JSON"
// weightDataBytes: 5023600
// weightSpecsBytes: 197
// __proto__: Object
// __proto__: Object

// _________________________________________________________________
// tf-layers.esm.js:2767 Layer (type)                 Output shape              Param #   
// tf-layers.esm.js:2705 =================================================================
// tf-layers.esm.js:2767 flatten_Flatten1 (Flatten)   [null,12544]              0         
// tf-layers.esm.js:2708 _________________________________________________________________
// tf-layers.esm.js:2767 dense_Dense1 (Dense)         [null,100]                1254500   
// tf-layers.esm.js:2708 _________________________________________________________________
// tf-layers.esm.js:2767 dense_Dense2 (Dense)         [null,14]                 1400      
// tf-layers.esm.js:2708 =================================================================
// tf-layers.esm.js:2714 Total params: 1255900
// tf-layers.esm.js:2714 Trainable params: 1255900
// tf-layers.esm.js:2714 Non-trainable params: 0
// tf-layers.esm.js:2714 _________________________________________________________________
// CreateItem.js:293 undefined

// uncaught Error: Error when checking : expected flatten_Flatten1_input to have shape [null,7,7,256] but got array with shape [1,224,224,3].
//     at new t (tf-layers.esm.js:222)
//     at checkInputData (tf-layers.esm.js:4254)
//     at t.predict (tf-layers.esm.js:4482)
//     at t.predict (tf-layers.esm.js:4852)
//     at CreateItem.js:133

// the image that gets taken, wont predict on new e {isDisposedInternal: false, shape: Array(4), dtype: "float32", size: 150528, strides: Array(3), …}
// dataId: {}
// dtype: "float32"
// id: 168
// isDisposed: (...)
// isDisposedInternal: false
// rank: (...)
// rankType: "4"
// shape: (4) [1, 224, 224, 3]
// size: 150528
// strides: (3) [150528, 672, 3]
// __proto__: Object

// embeddings: 
// e {isDisposedInternal: false, shape: Array(4), dtype: "float32", size: 12544, strides: Array(3), …}
// dataId: {}
// dtype: "float32"
// id: 6161
// isDisposed: (...)
// isDisposedInternal: falserank: (...)
// rankType: "4"
// shape: (4) [1, 7, 7, 256]
// size: 12544
// strides: (3) [12544, 1792, 256]
// __proto__: Object


// Uncaught Error: Error in oneHot: depth must be >=2, but it is 1
//     at oneHot_ (tf-core.esm.js:6507)
//     at Module.oneHot (tf-core.esm.js:2469)
//     at SaveData.js:37
//     at tf-core.esm.js:1339
//     at e.scopedRun (tf-core.esm.js:1345)
//     at e.tidy (tf-core.esm.js:1334)
//     at Module.e.tidy (tf-core.esm.js:1801)
//     at ControllerDataset.addExample (SaveData.js:36)
//     at CreateItem.js:136
//     at tf-core.esm.js:1339
//     at e.scopedRun (tf-core.esm.js:1345)
//     at e.tidy (tf-core.esm.js:1334)
//     at Module.e.tidy (tf-core.esm.js:1801)
//     at CreateItem.js:136
// oneHot_ @ tf-core.esm.js:6507
// oneHot @ tf-core.esm.js:2469
// (anonymous) @ SaveData.js:37
// (anonymous) @ tf-core.esm.js:1339
// e.scopedRun @ tf-core.esm.js:1345
// e.tidy @ tf-core.esm.js:1334
// e.tidy @ tf-core.esm.js:1801
// addExample @ SaveData.js:36
// (anonymous) @ CreateItem.js:136
// (anonymous) @ tf-core.esm.js:1339
// e.scopedRun @ tf-core.esm.js:1345
// e.tidy @ tf-core.esm.js:1334
// e.tidy @ tf-core.esm.js:1801
// (anonymous) @ CreateItem.js:136
// setInterval (async)
// CreateItem._this.getExamples @ CreateItem.js:132
// callCallback @ react-dom.development.js:147
// invokeGuardedCallbackDev @ react-dom.development.js:196
// invokeGuardedCallback @ react-dom.development.js:250
// invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:265
// executeDispatch @ react-dom.development.js:571
// executeDispatchesInOrder @ react-dom.development.js:596
// executeDispatchesAndRelease @ react-dom.development.js:695
// executeDispatchesAndReleaseTopLevel @ react-dom.development.js:704
// forEachAccumulated @ react-dom.development.js:676
// runEventsInBatch @ react-dom.development.js:844
// runExtractedEventsInBatch @ react-dom.development.js:852
// handleTopLevel @ react-dom.development.js:5027
// batchedUpdates$1 @ react-dom.development.js:20269
// batchedUpdates @ react-dom.development.js:2246
// dispatchEvent @ react-dom.development.js:5107
// interactiveUpdates$1 @ react-dom.development.js:20331
// interactiveUpdates @ react-dom.development.js:2267
// dispatchInteractiveEvent @ react-dom.development.js:5083


//Training another item
// Uncaught (in promise) Error: Error when checking input: expected flatten_Flatten1_input to have 4 dimension(s). but got array with shape 20,14 (when i set the data size to 50 is said 20, 50)
//     at new t (tf-layers.esm.js:222)
//     at standardizeInputData (tf-layers.esm.js:4186)
//     at t.standardizeUserData (tf-layers.esm.js:4500)
//     at tf-layers.esm.js:4073
//     at tf-layers.esm.js:156
//     at Object.next (tf-layers.esm.js:169)
//     at tf-layers.esm.js:76
//     at new Promise (<anonymous>)
//     at __awaiter (tf-layers.esm.js:53)f
//     at fitTensors (tf-layers.esm.js:4064)
//     at t.<anonymous> (tf-layers.esm.js:4615)
//     at tf-layers.esm.js:156
//     at Object.next (tf-layers.esm.js:169)
//     at tf-layers.esm.js:76
//     at new Promise (<anonymous>)
//     at __awaiter (tf-layers.esm.js:53)
//     at t.fit (tf-layers.esm.js:4613)
//     at t.<anonymous> (tf-layers.esm.js:4861)
//     at tf-layers.esm.js:156
//     at Object.next (tf-layers.esm.js:169)
//     at tf-layers.esm.js:76
//     at new Promise (<anonymous>)
//     at __awaiter (tf-layers.esm.js:53)
//     at t.fit (tf-layers.esm.js:4858)
//     at _callee2$ (CreateItem.js:117)
//     at tryCatch (runtime.js:63)
//     at Generator.invoke [as _invoke] (runtime.js:282)
//     at Generator.prototype.(:3000/anonymous function) [as next] (http://localhost:3000/static/js/0.chunk.js:105958:21)
//     at asyncGeneratorStep (asyncToGenerator.js:3)
//     at _next (asyncToGenerator.js:25)
//     at asyncToGenerator.js:32
//     at new Promise (<anonymous>)
//     at asyncToGenerator.js:21
//     at HTMLUnknownElement.callCallback (react-dom.development.js:147)
//     at Object.invokeGuardedCallbackDev (react-dom.development.js:196)
//     at invokeGuardedCallback (react-dom.development.js:250)
//     at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:265)
//     at executeDispatch (react-dom.development.js:571)
//     at executeDispatchesInOrder (react-dom.development.js:596)
//     at executeDispatchesAndRelease (react-dom.development.js:695)
//     at executeDispatchesAndReleaseTopLevel (react-dom.development.js:704)
//     at forEachAccumulated (react-dom.development.js:676)
//     at runEventsInBatch (react-dom.development.js:844)
//     at runExtractedEventsInBatch (react-dom.development.js:852)
//     at handleTopLevel (react-dom.development.js:5027)
//     at batchedUpdates$1 (react-dom.development.js:20269)
//     at batchedUpdates (react-dom.development.js:2246)
//     at dispatchEvent (react-dom.development.js:5107)
//     at interactiveUpdates$1 (react-dom.development.js:20331)
//     at interactiveUpdates (react-dom.development.js:2267)
// t @ tf-layers.esm.js:222
// standardizeInputData @ tf-layers.esm.js:4186
// t.standardizeUserData @ tf-layers.esm.js:4500
// (anonymous) @ tf-layers.esm.js:4073
// (anonymous) @ tf-layers.esm.js:156
// (anonymous) @ tf-layers.esm.js:169
// (anonymous) @ tf-layers.esm.js:76
// __awaiter @ tf-layers.esm.js:53
// fitTensors @ tf-layers.esm.js:4064
// (anonymous) @ tf-layers.esm.js:4615
// (anonymous) @ tf-layers.esm.js:156
// (anonymous) @ tf-layers.esm.js:169
// (anonymous) @ tf-layers.esm.js:76
// __awaiter @ tf-layers.esm.js:53
// t.fit @ tf-layers.esm.js:4613
// (anonymous) @ tf-layers.esm.js:4861
// (anonymous) @ tf-layers.esm.js:156
// (anonymous) @ tf-layers.esm.js:169
// (anonymous) @ tf-layers.esm.js:76
// __awaiter @ tf-layers.esm.js:53
// t.fit @ tf-layers.esm.js:4858
// _callee2$ @ CreateItem.js:117
// tryCatch @ runtime.js:63
// invoke @ runtime.js:282
// prototype.(anonymous function) @ runtime.js:116
// asyncGeneratorStep @ asyncToGenerator.js:3
// _next @ asyncToGenerator.js:25
// (anonymous) @ asyncToGenerator.js:32
// (anonymous) @ asyncToGenerator.js:21
// callCallback @ react-dom.development.js:147
// invokeGuardedCallbackDev @ react-dom.development.js:196
// invokeGuardedCallback @ react-dom.development.js:250
// invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:265
// executeDispatch @ react-dom.development.js:571
// executeDispatchesInOrder @ react-dom.development.js:596
// executeDispatchesAndRelease @ react-dom.development.js:695
// executeDispatchesAndReleaseTopLevel @ react-dom.development.js:704
// forEachAccumulated @ react-dom.development.js:676
// runEventsInBatch @ react-dom.development.js:844
// runExtractedEventsInBatch @ react-dom.development.js:852
// handleTopLevel @ react-dom.development.js:5027
// batchedUpdates$1 @ react-dom.development.js:20269
// batchedUpdates @ react-dom.development.js:2246
// dispatchEvent @ react-dom.development.js:5107
// interactiveUpdates$1 @ react-dom.development.js:20331
// interactiveUpdates @ react-dom.development.js:2267
// dispatchInteractiveEvent @ react-dom.development.js:5083

// pretrained shape (3) [7, 7, 256], packr shape: [id]
// error with making the tf.layers.flatten the loaded model
// Uncaught (in promise) Error: Input 0 is incompatible with layer flatten_Flatten1: expected min_ndim=3, found ndim=2.
//     at new t (tf-layers.esm.js:222)
//     at t.assertInputCompatibility (tf-layers.esm.js:1499)
//     at tf-layers.esm.js:1550
//     at nameScope (tf-layers.esm.js:566)
//     at t.apply (tf-layers.esm.js:1548)
//     at t.add (tf-layers.esm.js:4782)
//     at new t (tf-layers.esm.js:4756)
//     at Module.sequential (tf-layers.esm.js:4920)
//     at _callee2$ (CreateItem.js:74)
//     at tryCatch (runtime.js:63)
//     at Generator.invoke [as _invoke] (runtime.js:282)
//     at Generator.prototype.(:3000/anonymous function) [as next] (http://localhost:3000/static/js/1.chunk.js:105958:21)
//     at asyncGeneratorStep (asyncToGenerator.js:3)
//     at _next (asyncToGenerator.js:25)
//     at asyncToGenerator.js:32
//     at new Promise (<anonymous>)
//     at asyncToGenerator.js:21
//     at HTMLUnknownElement.callCallback (react-dom.development.js:147)
//     at Object.invokeGuardedCallbackDev (react-dom.development.js:196)
//     at invokeGuardedCallback (react-dom.development.js:250)
//     at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:265)
//     at executeDispatch (react-dom.development.js:571)
//     at executeDispatchesInOrder (react-dom.development.js:596)
//     at executeDispatchesAndRelease (react-dom.development.js:695)
//     at executeDispatchesAndReleaseTopLevel (react-dom.development.js:704)
//     at forEachAccumulated (react-dom.development.js:676)
//     at runEventsInBatch (react-dom.development.js:844)
//     at runExtractedEventsInBatch (react-dom.development.js:852)
//     at handleTopLevel (react-dom.development.js:5027)
//     at batchedUpdates$1 (react-dom.development.js:20269)
//     at batchedUpdates (react-dom.development.js:2246)
//     at dispatchEvent (react-dom.development.js:5107)
//     at interactiveUpdates$1 (react-dom.development.js:20331)
//     at interactiveUpdates (react-dom.development.js:2267)
//     at dispatchInteractiveEvent (react-dom.development.js:5083)

