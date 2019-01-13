import React, { Component } from 'react'
import { Loader, Icon } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import Webcam from "react-webcam";
import scanPackItems from './ScanPackItems'
import ScanPackItems from './ScanPackItems';
import VideoRecorder from './VideoRecorder'


class ScanPack extends Component{

    state={
        imageSrc: [],
        name: '',
        items: [],
        itemName: 'card'
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
        window.scrollTo(0,20)
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
    
    setRef = webcam => {
        this.webcam = webcam;
    }

    capture = () => {
        this.setState({
            imageSrc: [...this.state.imageSrc, this.webcam.getScreenshot().slice(23)],
        })
    }

    getItemName = (e) => this.setState({itemName: e.target.value})

    handleFlip = (e) => {
        if(this.state.itemName === 'card'){
            this.setState({itemName: 'card is-fliped'})
        } else if (this.state.itemName === 'card is-fliped'){
            this.setState({itemName: 'card'})
        } else {
            console.log('else')
        }
    }


    render(){
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: {exact: 'environment'}
          }
          const {items} = this.state 
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
                <Webcam
                // style={{position: 'fixed', top: '25px', left: '0'}}
                    audio={false}
                    height={400}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={200}
                    videoConstraints={videoConstraints}
                />
                {/* <VideoRecorder /> */}
                <div className={this.state.itemName}>
                <h1 onClick={this.handleFlip} style={{marginTop: '30px'}} className='item__face item__face--front'>Itmes in {this.state.name} Not Ready..</h1>
                <h1 onClick={this.handleFlip} style={{marginTop: '-40px'}} className='item__face item__face--back'><Icon name='check' /> {this.state.name} Ready to Go!</h1>
                </div>
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