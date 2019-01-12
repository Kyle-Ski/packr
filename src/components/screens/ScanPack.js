import React, { Component } from 'react'
import { Form, Message, Icon, Header, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";

const createUrl = 'http://localhost:3222/packr/create'

class ScanPack extends Component{

    state={
        imageSrc: [],
        itemName: '',
        name: '',
        items: []
    }

    fetchBackpack = () => {
        console.log(this.props.match)
        this.setState({backpack: this.props.match.params.id})
        fetch(`http://localhost:3222/packs/${this.props.match.params.id}/items`)
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

    componentDidMount(){
        this.fetchBackpack()
            // .then(() => {
            //     if(this.state.backpack > 2){
            //         this.setState({name: ['knife', 'glue', 'code']})
            //     } else {
            //         this.setState({name: ['tent', 'water bottle', 'code']})
            //     }
            // })
            // .catch(console.warn)
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
            <div style={{
                    position: 'fixed',
                    top: '25px',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'

                }}>
                <Webcam
                    audio={false}
                    height={300}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    videoConstraints={videoConstraints}
                />
                <h1 style={{marginTop: '-30px'}} className='searching'>Itmes in {this.state.name} Not Ready..</h1>
                </div>
                <div style={{marginTop: '340px'}}>
                <Divider />
                <h3 className='found' ><Icon className='found' name='check'/>Hat</h3>
                <h3 className='searching'  ><Icon className='searching' name='search'/>Tent</h3>
                <h3 className='found' ><Icon className='found' name='check'/>Sleeping Bag</h3>
                <h3 className='found' ><Icon className='found' name='check'/>Stove</h3>
                <h3 className='searching'  ><Icon className='searching' name='search'/>Knife</h3>
                <h3 className='found' ><Icon className='found' name='check'/>Sleeping Bag</h3>
                <h3 className='found' ><Icon className='found' name='check'/>Stove</h3>
                <h3 className='searching'  ><Icon className='searching' name='search'/>Knife</h3>
                </div>
            </div>
        )
    }
}

export default ScanPack