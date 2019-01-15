import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ControllerDataset } from './SaveData'
import MobileNav from '../nav/MobileNav'
import * as tf from '@tensorflow/tfjs';


const createUrl = 'http://localhost:3222/items'
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
            lossThreshold: false
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
                this.saveData = new ControllerDataset(this.state.imageSrc + 1)
                this.model = this.model
                this.setState({ tfLoaded: true })
                return this.preTrained
            })
            .catch(err => console.error('componentDidMount err:', err))

    }


    train = async () => {
        if (this.saveData.xs == null) {
            throw new Error('Add some examples before training!');
        }
        const denseUnits = 100
        const totalNumItemsInDb = this.state.imageSrc + 1
        const learningRate = 0.0001
        const epochs = 20
        const batchSizeFraction = 0.4
        this.model = tf.sequential({
            layers: [
                // Flattens the input to a vector so we can use it in a dense layer. While
                // technically a layer, this only performs a reshape (and has no training
                // parameters).
                tf.layers.flatten({
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
        this.model.compile({ optimizer: optimizer, loss: 'categoricalCrossentropy' });
        // We parameterize batch size as a fraction of the entire dataset because the
        // number of examples that are collected depends on how many examples the user
        // collects. This allows us to have a flexible batch size.
        const batchSize =
            Math.floor(this.saveData.xs.shape[0] * batchSizeFraction)
        if (!(batchSize > 0)) {
            throw new Error(
                `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
        }

        // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
        this.model.fit(this.saveData.xs, this.saveData.ys, {
            batchSize,
            epochs: epochs,
            callbacks: {
                onBatchEnd: async (batch, logs) => {
                    if(logs.loss.toFixed(6) <= 0.000001) this.setState({lossThreshold: true})
                    console.log('Loss: ' + logs.loss.toFixed(6), this.saveData.ys);
                }
            }
        })
    }


    getExamples = () => {
        const label = this.state.imageSrc
        var startGetting = setInterval(() => {
            const img = this.capture()
            const example = this.preTrained.predict(img)
            tf.tidy(() => this.saveData.addExample(example, label))
            this.setState({ imgCount: this.state.exampleCount + 1 })
            if (this.state.exampleCount === 20) {
                clearInterval(startGetting)
                console.log('label', label)
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
        const { warning, tfLoaded, imgCount, predictCount, lossThreshold } = this.state
        const { itemId, itemName } = this.props
        return (
            <div>
                <div>
                    <MobileNav signOut={this.props.signOut} />
                </div>
                <Header as='h1' style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}>Center {itemName ? itemName : `Item`} in view</Header>
                <video id='preview' ref="preview" width="360" height="224" autoPlay muted playsInline></video>
                {tfLoaded && itemId ? <p style={{ color: 'white' }}>Loaded!</p> : <Loader size='mini' active>Loading..</Loader>}
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
                        {
                            itemId ?
                                <div>
                                    {imgCount === 20 ? '':<button style={{ width: '170px' }} className='add-button create' onClick={this.getExamples} ><Icon name='camera' /><span className='no-copy'>Scan {itemName}</span></button>}
                                    {imgCount === 20 ? <button style={{ width: '170px', backgroundColor: 'olive' }} className='add-button create' onClick={this.train} ><i className="fas fa-brain" style={{ color: 'white', marginRight: '7px' }}>  </i>Teach Me {itemName}!</button>:''}
                                    {lossThreshold ? <button style={{ width: '170px', backgroundColor: 'red' }} className='add-button create' onClick={this.predictTheImage} ><Icon name='stop circle outline' /><span className='no-copy'>Predict {itemName}</span></button>:<Loader active>Teaching...</Loader>}
                                </div>
                                :
                                <Loader size='mini' active>Loading...</Loader>
                        }
                    </div>
                </Form>
                <h3 style={{ color: 'white' }}>{imgCount} scans, {imgCount/*.length*/ >= 20 ? `Good ammount! Ready to Learn!` : `More scans please..`}</h3>
                <h3 style={{ color: 'white' }}>{predictCount} prediction scans</h3>
                {lossThreshold ? <Link to='/add-items'><button style={{ width: '170px' }} className='add-button create' onClick={this.props.sendItem} ><Icon name='plus'/> Add {itemName} to a Pack!</button></Link> : ''}
            </div>
        )
    }
}

export default CreateItem