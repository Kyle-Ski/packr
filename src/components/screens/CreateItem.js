import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider, Loader, Responsive } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';

const createUrl = 'http://localhost:3222/items'
class CreateItem extends Component{

    state={
        imageSrc: 0,
        warning: null,
        tfLoaded: false,
        mouseDown: false
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
    

    predict = async () => {
        // this.setState({mouseDown: true})
        // while(this.state.mouseDown){
            try { 
                const predictedClass = tf.tidy(() => {
                    const img = this.capture()
                    const prediction = this.modelHelper.predict(img)
                    return prediction.as1D().argMax()
                })
                const classId = (await predictedClass.data())[0]
                predictedClass.dispose()
                console.log('classId', classId)
                await tf.nextFrame()

            } catch (err){
                console.warn('Catch', err)
            }
           
        // }
        //setinterval(fn, time), clearInterval
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
        this.setState({mouseDown:false})
        console.log('up')
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
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: {exact: 'environment'}
          }
          const {warning, tfLoaded, imageSrc} = this.state
          const {itemId, itemName} = this.props
        return(
            <div>
            <div>
                <MobileNav signOut={this.props.signOut}/>
            </div>
            <Header as='h1' style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}}>Center {itemName? itemName: `Item`} in view</Header>
            <video id='preview' ref="preview" width="360" height="225" autoPlay muted playsInline></video>
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
                    <Responsive minWidth={768} >
                            <button style={{ width: '170px' }} className='add-button create' onMouseDown={this.predict} onMouseUp={this.mouseUp}><Icon name='camera' /><span className='no-copy'>Scan {itemName}</span></button>
                    </Responsive>
                    <Responsive maxWidth={767}>
                        <button style={{ width: '170px' }} className='add-button create' onTouchStart={this.predict} onTouchEnd={this.mouseUp}><Icon name='camera' /><span className='no-copy'>Scan {itemName}</span></button>
                    </Responsive>
                    </div>
                    :
                    <Loader size='mini' active>Loading...</Loader>
                    }
                    </div>
                </Form>
                <h3 style={{color: 'white'}}>{imageSrc} scans, {imageSrc/*.length*/ >= 10 ? `Good ammount! Ready to Learn!`:`More scans please..`}</h3>
                {imageSrc>=10 ? <Link to='/add-items'><button style={{width: '170px'}} className='add-button create' onClick={this.props.sendItem} ><i class="fas fa-brain" style={{color: 'white', marginRight: '7px'}}>  </i>Teach Me {itemName}!</button></Link>: ''}
            </div>
        )
    }
}

export default CreateItem