import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider, CommentContent } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';

const createUrl = 'http://localhost:3222/items'
class CreateItem extends Component{

    state={
        imageSrc: 0,
        itemName: '',
        warning: null,
        tfLoaded: false,
        itemId: null
    }

    componentDidMount(){
        this.setup()
            .then(res => {
                console.log(res)
                return res
            })
            .then(this.modelHelper)
            .then(res => {
                console.log('res from modelHelper',res)
                this.setState({tfLoaded: true})
                return res
            })
            .catch(err => console.error('componentDidMount err:', err))
    }

    modelHelper = () => {
        tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
            .then(mobilenet => {
                const layer = mobilenet.getLayer('conv_pw_13_relu')
                return tf.model({inputs: mobilenet.inputs, outputs: layer.output})
            })
        // Return a model that outputs an internal activation.
      }
    
    // setRef = webcam => {
    //     this.webcam = webcam;
    // }

    // capture = () => {
        // this.setState({
        //     imageSrc: [...this.state.imageSrc, this.webcam.getScreenshot().slice(23)],
        // })
    //     this.setState({imageSrc: this.state.imageSrc+=1})
    // }

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
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: {exact: 'environment'}
          }
          const {warning, tfLoaded, itemId} = this.state
        return(
            <div>
            <div>
                <MobileNav signOut={this.props.signOut}/>
            </div>
            <Header as='h1' style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}}>Center Item in view</Header>
            <video id='preview' ref="preview" width="360" height="400" autoPlay muted playsInline></video>
            {tfLoaded && itemId?<p style={{color: 'white'}}>Loaded!</p>: <p style={{color: 'red'}}>Loading?</p>}
                {/* <Webcam
                    audio={false}
                    height={500}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    videoConstraints={videoConstraints}
                /> */}
                <Divider />
                <Form className={warning} onSubmit={() => console.log('submit')}>
                <Header as='h4' style={{color: 'white'}}>Item Name</Header>
                    <Form.Input required onChange={this.getItemName} placeholder='Item Name...' icon='pencil alternate' />
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
                    itemId ? <button className='add-button scan' onClick={this.capture}><Icon name='camera' />Scan Item</button> :
                    <button className='add-button create' onClick={this.sendItem} ><Icon name='plus' /> Create Item</button>
                    }
                    </div>
                </Form>
                <h3 style={{color: 'white'}}>{this.state.imageSrc} scans, {this.state.imageSrc/*.length*/ >= 10 ? `Good ammount! Ready to Learn!`:`More scans please..`}</h3>
            </div>
        )
    }
}

export default CreateItem