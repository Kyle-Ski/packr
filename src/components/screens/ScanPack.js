import React, { Component } from 'react'
import { Divider, Loader, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";
import scanPackItems from './ScanPackItems'
import ScanPackItems from './ScanPackItems';


class ScanPack extends Component{

    state={
        imageSrc: [],
        itemName: '',
        name: '',
        items: [],
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

    componentDidMount(){
        this.fetchBackpack()
        .catch(err => console.warn(err))
            // .then(() => {
            //     if(this.state.backpack > 2){
            //         this.setState({name: ['knife', 'glue', 'code']})
            //     } else {
            //         this.setState({name: ['tent', 'water bottle', 'code']})
            //     }
            // })
            // .catch(console.warn)
    }

    handleFlip = (e) => {
        console.log(e.target)
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

    render(){
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "forward"
          }
          const {items} = this.state 
        return(
            <div>
            {items.length > 0 ? <div><div>
                <MobileNav />
            </div>
            <div style={{
                    position: 'fixed',
                    top: '25px',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '1'

                }}>
                <Webcam
                    audio={false}
                    height={400}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={300}
                    videoConstraints={videoConstraints}
                />
                <h1 style={{marginTop: '-30px'}} className='searching'>Itmes in {this.state.name} Not Ready..</h1>
                </div>
                <div style={{marginTop: '400px'}}>
                <ScanPackItems style={{zIndex: '-1'}} items={items}/>
                </div></div>:<div><Loader active /></div>}
            </div>
        )
    }
}

export default ScanPack