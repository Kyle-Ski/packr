import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";

const createUrl = 'https://packr-database.herokuapp.com/create'

class CreateItem extends Component{

    state={
        imageSrc: [],
        itemName: '',
    }
    
    setRef = webcam => {
        this.webcam = webcam;
    }

    capture = () => {
        this.setState({
            imageSrc: [...this.state.imageSrc, this.webcam.getScreenshot().slice(23)],
        })
    }

    getItemName = (e) => this.setState({itemName: e.target.value})

    sendItem =  () => {
        console.log(JSON.stringify(this.state.imageSrc[0]))
        fetch(createUrl/*, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                'img': this.state.imageSrc[0],
                'id': this.state.itemName
            })
        }*/)
        .then(response => response.json())
        .then(res => console.log(res))
        .catch(err => console.warn(err))
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
            <Header as='h1' style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}}>Center Item in view</Header>
            
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
                <Header as='h4' style={{color: 'white'}}>Item Name</Header>
                    <Form.Input onChange={this.getItemName} placeholder='Item Name...' icon='pencil alternate' />
                    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
                    <button className='add-button scan' onClick={this.capture}><Icon name='camera' />Scan Item</button>
                    <button className='add-button create' onClick={this.sendItem} ><Icon name='plus' /> Create Item</button>
                </Form>
                <p style={{color: 'white'}}>{this.state.imageSrc.length } scans, {this.state.imageSrc.length >= 10 ? `Good ammount!`:`more scans please..`}</p>
                <p>{this.state.imageSrc[0]}</p>
            </div>
        )
    }
}

export default CreateItem