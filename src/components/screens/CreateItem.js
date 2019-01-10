import React, { Component } from 'react'
import { Button, Form, Message, Icon, Header, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";

class CreateItem extends Component{

    state={
        imageSrc: ''
    }
    
    setRef = webcam => {
        this.webcam = webcam;
    }

    capture = () => {
        this.setState({imageSrc: this.webcam.getScreenshot()})
    }

    render(){
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "forward"
          }
        return(
            <div>
            <div>
                <MobileNav />
            </div>
            <Header as='h1'>Center Item in view</Header>
            
                <Webcam
                    audio={false}
                    height={300}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    videoConstraints={videoConstraints}
                />
                <Divider />
                <Form className={'warning'} onSubmit={() => console.log('submit')}>
                    <Form.Input label='Item Name' placeholder='Item Name...' icon='pencil alternate' />
                    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
                    <Button size={`medium`} toggle={true} color={`olive`} onClick={this.capture}><Icon name='camera' />Scan Item</Button>
                    <Button size={`medium`} toggle={true} color={`green`} ><Link to='profile'>+ Create Item</Link></Button>
                </Form>
            </div>
        )
    }
}

export default CreateItem