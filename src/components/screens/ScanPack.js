import React, { Component } from 'react'
import { Loader, Icon } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import ScanPackItems from './ScanPackItems';
import * as tf from '@tensorflow/tfjs'
import { ControllerDataset } from './SaveData'

const totalItemUrl = 'http://localhost:3222/items'

class ScanPack extends Component{

    state={
        imageSrc: [],
        name: '',
        items: [],
        itemName: 'card',
        totalItems: 0,
    }

    fetchBackpack = () => {
        console.log(this.props.match)
        this.setState({backpack: this.props.match.params.id})
        return fetch(`https://packr-database.herokuapp.com/packs/${this.props.match.params.id}/items`)
            .then(res => res.json())
            .then(res => {
                if(res.error){
                    alert(res.error)
                    return this.setState({error: res.error})
                } else {
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
            let loadingPackr = tf.loadModel('indexeddb://my-model-1')
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
        var startPredicting = setInterval(async () => {
            try {
                const predictedClass = tf.tidy(() => {
                    const img = this.capture()
                    const embeddings = this.preTrained.predict(img)
                    const predictions = this.packrModel.predict(embeddings)
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
                console.warn('Predict Catch', err)
            }   
        }, 300)
    }

    adjustVideoSize = (width, height) => {
        const aspectRatio = width / height;
        if (width >= height) {
            this.refs.preview.width = aspectRatio * this.refs.preview.height;
        } else if (width < height) {
            this.refs.preview.height = this.refs.preview.width / aspectRatio;
        }
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


    render(){
          const {items, name} = this.state 
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
                    zIndex: '1'

                }}>
                <video id='preview' ref="preview" width="360" height="224" autoPlay muted playsInline></video>
                <div className={this.state.itemName}>
                <h1 onClick={this.handleFlip} style={{marginTop: '30px'}} className='item__face item__face--front'>Itmes in {this.state.name} Not Ready..</h1>
                <h1 onClick={this.handleFlip} style={{marginTop: '-40px'}} className='item__face item__face--back'><Icon name='check' /> {this.state.name} Ready to Go!</h1>
                </div>
                <button className='add-button create' onClick={this.listModels}>list models</button>
                <button style={{ width: '170px' }} className='add-button create' onClick={this.getExamples} ><Icon name='camera' /><span className='no-copy'>Scan {name}</span></button>
                </div>
                <div style={{zIndex: '-1', marginTop: '600px'}}>
                <ScanPackItems  items={items}/>
                </div>
                </div>
                </div>:<div><Loader active /></div>}
            </div>
        )
    }
}

export default ScanPack