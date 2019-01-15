import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider, Loader, Responsive } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ControllerDataset } from './SaveData'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';

const createUrl = 'http://localhost:3222/items'
class CreateItem extends Component{

    state={
        imageSrc: 0,
        warning: null,
        tfLoaded: false,
        mouseDown: false,
        imgCount: 0
    }

    componentDidMount(){
        this.setup()
            // .then(res => {
            //     console.log(res)
            //     return res
            // })
            // .then(this.modelHelper)
            .then(res => {
                console.log('res from modelHelper',res)
                this.setState({tfLoaded: true , imageSrc: this.props.itemId})
                return res
            })
            .catch(err => console.error('componentDidMount err:', err))
    }

    modelHelper = async () => {
        const mobilenet = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
        console.log('mobilenet', mobilenet.layers())
        const layer = mobilenet.getLayer('conv_pw_13_relu')
        return tf.model({inputs: mobilenet.inputs, outputs: layer.output})
        // Return a model that outputs an internal activation.
      }
    
      train = async (preTrained) => {
        //preTrained is the cosnt mobilenet = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
        //const layer = mobilenet.getLayer('conv_pw_13_relu')
        //return tf.model({inputs: mobilenet.inputs, outputs: layer.output})  <------!!!!
        if (this.state.imgCount < 20) {
          throw new Error('Add some examples before training!');
        }
        const denseUnits = 100
        const totalNumItemsInDb = this.state.imageSrc + 1
        const learningRate = 0.0001
        const epochs = 20
        // Creates a 2-layer fully connected model. By creating a separate model,
        // rather than adding layers to the mobilenet model, we "freeze" the weights
        // of the mobilenet model, and only train weights from the new model.
        model = tf.sequential({
          layers: [
            // Flattens the input to a vector so we can use it in a dense layer. While
            // technically a layer, this only performs a reshape (and has no training
            // parameters).
            tf.layers.flatten({
              inputShape: preTrained.outputs[0].shape.slice(1)
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
        model.compile({ optimizer: optimizer, loss: 'categoricalCrossentropy' });

        // We parameterize batch size as a fraction of the entire dataset because the
        // number of examples that are collected depends on how many examples the user
        // collects. This allows us to have a flexible batch size.
        const batchSize =
            Math.floor(controllerDataset.xs.shape[0] * ui.getBatchSizeFraction());
        if (!(batchSize > 0)) {
            throw new Error(
                `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
        }

        // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
        model.fit(controllerDataset.xs, controllerDataset.ys, {
            batchSize,
            epochs: ui.getEpochs(),
            callbacks: {
                onBatchEnd: async (batch, logs) => {
                    ui.trainStatus('Loss: ' + logs.loss.toFixed(5));
                }
            }
        });
    }

        // var startPredicting = setInterval(async()=>{
    //     const mobilenet = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
    //     const layer = mobilenet.getLayer('conv_pw_13_relu')
    //     try { 
    //         const predictedClass = tf.tidy(() => {
    //             const img = this.capture()
    //             const prediction = tf.model({inputs: mobilenet.inputs, outputs: layer.output}).predict(img)
    //             return prediction.as1D().argMax()
    //         })
    //         const classId = (await predictedClass.data())[0]
    //         console.log('predictedClassId:', classId)
    //         predictedClass.dispose()
    //         await tf.nextFrame() 
    //         this.setState({imgCount: this.state.imgCount+=1})
    //         if(this.state.imgCount === 20) {
    //             clearInterval(startPredicting)

    //         }
    //     } catch (err){
    //         console.warn('Catch', err)
    //     }    
       
    //     }, 600)

    timer = () =>{
        var startPredicting = setInterval(async()=>{
        const mobilenet = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
        const layer = mobilenet.getLayer('conv_pw_13_relu')
        const saveData = new ControllerDataset(this.state.imageSrc)
        try { 
            const predictedClass = tf.tidy(() => {
                const img = this.capture()
                const prediction = tf.model({inputs: mobilenet.inputs, outputs: layer.output})
                tf.tidy(() => saveData.addExample(prediction.predict(img), this.state.imageSrc))
                return prediction.as1D().argMax()
            })
            const classId = (await predictedClass.data())[0]
            console.log('predictedClassId:', classId)
            predictedClass.dispose()
            await tf.nextFrame() 
            this.setState({imgCount: this.state.imgCount+=1})
            if(this.state.imgCount === 20) {
                clearInterval(startPredicting)

            }
        } catch (err){
            console.warn('Catch', err)
        }    
       
        }, 600)
    }

    stopTimer=() =>{
        console.log('stop')
        return clearInterval(this.timer)
    }
    // capture = () => {
        // this.setState({
        //     imageSrc: [...this.state.imageSrc, this.webcam.getScreenshot().slice(23)],
        // })
        // this.setState({imageSrc: this.state.imageSrc+=1})
        // while(this.state.mouseDown){
        //     this.setState({imageSrc: this.state.imageSrc+=1})
        // }
    // }

    mouseUp = () =>{
        
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
                {video: true},
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
    
    

    getItemName = (e) => this.setState({itemName: e.target.value})

    sendItem =  () => {
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
            if(res.error){
                this.setState({warning: 'warning'})
                return res
            } else {
                this.setState({warning: 'success', itemId: res.item.id})
                return res
            }
        })
        .catch(err => console.warn(err))
    }

    render(){
          const {warning, tfLoaded, imgCount} = this.state
          const {itemId, itemName} = this.props
        return(
            <div>
            <div>
                <MobileNav signOut={this.props.signOut}/>
            </div>
            <Header as='h1' style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}}>Center {itemName? itemName: `Item`} in view</Header>
            <video id='preview' ref="preview" width="360" height="224" autoPlay muted playsInline></video>
            {tfLoaded && itemId?<p style={{color: 'white'}}>Loaded!</p>: <Loader size='mini' active>Loading..</Loader>}
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
                        <button style={{ width: '170px' }} className='add-button create' onClick={this.timer} ><Icon name='camera' /><span className='no-copy'>Scan {itemName}</span></button>
                        <button style={{ width: '170px', backgroundColor: 'red' }} className='add-button create' onClick={this.predictImage} ><Icon name='stop circle outline' /><span className='no-copy'>Predict {itemName}</span></button>
                    </div>
                    :
                    <Loader size='mini' active>Loading...</Loader>
                    }
                    </div>
                </Form>
                <h3 style={{color: 'white'}}>{imgCount} scans, {imgCount/*.length*/ >= 20 ? `Good ammount! Ready to Learn!`:`More scans please..`}</h3>
                {imgCount>=20 ? <Link to='/add-items'><button style={{width: '170px'}} className='add-button create' onClick={this.props.sendItem} ><i className="fas fa-brain" style={{color: 'white', marginRight: '7px'}}>  </i>Teach Me {itemName}!</button></Link>: ''}
            </div>
        )
    }
}

export default CreateItem