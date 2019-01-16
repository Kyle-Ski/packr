import React, { Component } from 'react'
import { Loader, Icon } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import ScanPackItems from './ScanPackItems';
import * as tf from '@tensorflow/tfjs'

const totalItemUrl = 'https://packr-database.herokuapp.com/items'

class ScanPack extends Component{

    state={
        imageSrc: [],
        name: '',
        items: [],
        itemName: 'card',
        totalItems: 0,
        predictingMessage: 'not yet predicting',
        predictCount: 0
    }

    fetchBackpack = () => {
        this.setState({backpack: this.props.match.params.id})
        return fetch(`https://packr-database.herokuapp.com/packs/${this.props.match.params.id}/items`)
            .then(res => res.json())
            .then(res => {
                
                if(res.error){
                    alert(res.error)
                    return this.setState({error: res.error})
                } else {
                    console.log('fetch backpack',res.backpack)
                    this.setState({items: res.backpack.items, name: res.backpack.backpack_name})
                }
            })
    }

    fetchTotalItems = () => {
        return fetch(totalItemUrl)
            .then(res => res.json())
            .then(res => {
                if(res.error){
                    console.warn('fetchitems err:', res.error)
                    return this.setState({error: res.error})
                } else {
                    this.setState({totalItems: res.items.length})
                }
            })
    }

    componentDidMount(){
        this.fetchBackpack()
        .then(this.fetchTotalItems)
        .then(this.setup)
        .then(() => {
            let mobilenet = tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
            return mobilenet
        })
        .then(mobilenet => {
            let layer = mobilenet.getLayer('conv_pw_13_relu')
            this.preTrained = tf.model({ inputs: mobilenet.inputs, outputs: layer.output })
            return this.preTrained
        })
        .then(() => {
            let loadingPackr = tf.loadModel('indexeddb://packr-model')
            return loadingPackr
        })
        .then(loadingPackr => {
            this.packrModel = loadingPackr
            return this.packrModel
        })
        .catch(err => console.warn(err))
    }

    listModels = async () => {
        console.log(await tf.io.listModels());
    }
    
    predictTheImage = () => {
        this.setState({predictingMessage: 'Predicting...'})
        var startPredicting = setInterval(async () => {
            try {
                const predictedClass = tf.tidy(() => {
                    const img = this.capture()
                    const embeddings = this.preTrained.predict(img)
                    const predictions = this.packrModel.predict(embeddings)
                    // const predictions = this.preTrained.predict(img)
                    return predictions.as1D().argMax()
                })
                const classId = (await predictedClass.data())[0]
                console.log('predictedClassId:', classId)
                predictedClass.dispose()
                await tf.nextFrame()
                this.setState({ predictCount: this.state.predictCount + 1 })
                if (this.state.predictCount === 35) {
                    clearInterval(startPredicting)
                    this.setState({predictingMessage: 'Done Predicting'})

                }
            } catch (err) {
                console.warn('Predict Catch', err)
            }   
        }, 300)
    }

    adjustVideoSize = (width, height) => {
        const aspectRatio = height / width;
        if (width >= height) {
            this.refs.preview.width = aspectRatio * this.refs.preview.height;
        } else if (width < height) {
            this.refs.preview.height = this.refs.preview.width / aspectRatio;
        }
    }

    cropImage = (img) => {
        const size = Math.min(img.shape[0], img.shape[1]);
        const centerHeight = img.shape[0] / 2;
        const beginHeight = centerHeight - (size / 2);
        const centerWidth = img.shape[1] / 2;
        const beginWidth = centerWidth - (size / 2);
        return img.slice([beginHeight, beginWidth, 0], [224, 224, 3]);
    }



    capture = () => {
        return tf.tidy(() => {
            // Reads the image as a Tensor from the webcam <video> element.
            const webcamImage = tf.fromPixels(this.refs.preview);
            // console.log('Webcam image tf.fromPixels:',webcamImage)
            // Crop the image so we're using the center square of the rectangular
            // webcam.
            const croppedImage = this.cropImage(webcamImage)
            // console.log('cropped image after tf.fromPixels:',croppedImage)
            // Expand the outer most dimension so we have a batch size of 1.
            const batchedImage = croppedImage.expandDims(0);
            // console.log('batched img', batchedImage)
            // Normalize the image between -1 and 1. The image comes in between 0-255,
            // so we divide by 127 and subtract 1.
            return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
        });
    }

    getItemName = (e) => this.setState({itemName: e.target.value})

    handleFlip = (e) => {
        if(this.state.itemName === 'card'){
            this.setState({itemName: 'card is-fliped'})
        } /*else if (this.state.itemName === 'card is-fliped'){
            this.setState({itemName: 'card'})
        } else {
            console.log('else')
        }*/
    }

    setup = () => {
        return new Promise((resolve, reject) => {
            const navigatorAny = navigator;
            navigator.getUserMedia = navigator.getUserMedia ||
                navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
                navigatorAny.msGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: {facingMode: {exact: 'environment'} }})
                .then(stream => {
                    this.refs.preview.srcObject = stream;
                    this.refs.preview.addEventListener('loadeddata', async () => {
                        this.adjustVideoSize(
                            this.refs.preview.videoWidth,
                            this.refs.preview.videoHeight);
                        resolve();
                    }, false);
                })
                .catch(err=> reject())
            } else {
                reject();
            }
        });
    }


    render(){
          const {items, name, predictingMessage} = this.state 
        return(
            <div>
            {items.length > 0 ? <div><div>
                <MobileNav signOut={this.props.signOut}/>
            </div>
            <div>
            <div style={{
                    position: 'fixed',
                    top: '25px',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '1',
                    marginTop: '23px'

                }}>
                <video id='preview' style={{marginLeft: '-40px'}} ref="preview" width="500" height="500" autoPlay muted playsInline></video>
                <div style={{marginTop: '-25px'}} className={this.state.itemName}>
                <h1 onClick={this.handleFlip} style={{marginTop: '30px'}} className='item__face item__face--front'>Itmes in {this.state.name} Not Ready..</h1>
                <h1 onClick={this.handleFlip} style={{marginTop: '-40px'}} className='item__face item__face--back'><Icon name='check' /> {this.state.name} Ready to Go!</h1>
                </div>
                {/* <button className='add-button create' onClick={this.listModels}>list models</button> */}
                <button style={{ width: '170px' }} className='add-button create' onClick={this.predictTheImage} ><Icon name='camera' /><span className='no-copy'>Scan {name}</span></button>
                {/* <h3 style={{color: 'white'}}>Predicting Message: {predictingMessage}</h3> */}
                </div>
                <div style={{zIndex: '-1', marginTop: '69vh'}}>
                <div style={{backgroundColor: 'rgb(94, 94, 84, 0.6)', height: 'fit-content', borderRadius: '60px', borderStyle: 'dashed', borderColor: '#969684', paddingTop: '7vh', paddingBottom: '2vh'}}>
                <ScanPackItems  items={items}/>
                </div>
                </div>
                </div>
                </div>:<div><Loader active /></div>}
            </div>
        )
    }
}

export default ScanPack

/*{isDisposedInternal: false, 
    shape: Array(3), 
    dtype: "int32", 
    size: 218160, 
    strides: Array(2), …}
    dataId: {}
    dtype: "int32"
    id: 525
    isDisposed: (...)
    isDisposedInternal: truerank: (...)
    rankType: "3"
    shape: (3) [360, 202, 3]
    size: 218160
    strides: (2) 
    [606, 3]__proto__: Object
    
    
    Cropped Image
    
    DataId: {}
    dtype: "int32"
    id: 422
    isDisposed: (...)
    isDisposedInternal: true
    rank: (...)
    rankType: "3"
    shape: (3) [202, 202, 3]
    size: 122412
    strides: (2) [606, 3]
    __proto__: Object


    Error from phone: 
     Error when checking : 
     expected input_1 to have shape [null,224,224,3] but got array with shape [1,270,270,3].


     Cropped
     e {isDisposedInternal: false, shape: Array(3), dtype: "int32", size: 218700, strides: Array(2), …}
dataId: {}
dtype: "int32"
id: 461
isDisposed: (...)
isDisposedInternal: true
rank: (...)
rankType: "3"
shape: (3) [270, 270, 3]
size: 218700
strides: (2) [810, 3]
__proto__: Object

Webcam
e {isDisposedInternal: false, shape: Array(3), dtype: "int32", size: 291600, strides: Array(2), …}
dataId: {}
dtype: "int32"
id: 460
isDisposed: (...)
isDisposedInternal: true
rank: (...)
rankType: "3"
shape: (3) [270, 360, 3]
size: 291600
strides: (2) [1080, 3]
__proto__: Object

e {isDisposedInternal: false, shape: Array(3), dtype: "int32", size: 562500, strides: Array(2), …}
dataId: {}
dtype: "int32"
id: 436
isDisposed: (...)
isDisposedInternal: true
rank: (...)
rankType: "3"
shape: (3) [375, 500, 3]
size: 562500
strides: (2) [1500, 3]
__proto__: Object
*/

let img = 
{dataId: {},
dtype: "int32",
id: 436,
isDisposed: (false),
isDisposedInternal: true,
rank: ("3"),
rankType: "3",
shape: (3) [375, 500, 3],
size: 562500,
strides: (2) [1500, 3]}

