import React, { Component } from 'react'
import { Image, Header, Divider, Card, Loader, Icon } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
import ProfilePacks from './ProfilePacks'

const profileImg = './20180709_064947.png'

const userPacksUrl = 'https://packr-database.herokuapp.com/users/'

class Profile extends Component {

    state = {
        packs: [],
    }

    fetchUserPacks = () => {
        fetch(userPacksUrl + this.props.user.id)
            .then(res => res.json())
            .then(res =>{
                this.setState({packs: res.user[0].backpacks})
                return res
            })
            .catch(err => console.warn('fetch user packs error:',err))
    }

    componentDidMount(){
        this.fetchUserPacks()
    }

    render(){
        const {packs} = this.state
        return(
            <div>
            <MobileNav signOut={this.props.signOut}/>
            {packs.length ?<div >
            
            <div style={{color: 'white', marginTop: '60px'}}>
            <Image circular src='https://i.imgur.com/HDXn6iS.png' size='small' avatar/>
            <Header style={{color: 'white'}} as='h2'>{this.props.user.first_name} {this.props.user.last_name}</Header>
            </div>
            
            <Header style={{color: 'white', }} as='h1'>Trips:</Header>
            <Divider />
            <div >
            <Card.Group centered>
            <ProfilePacks packs={this.state.packs}/>
            </Card.Group>
            <Divider />
            <Link style={{color: 'white'}} to='add-pack'><button className='add-button create' style={{color: 'white'}} ><Icon name='add' />Add Trip</button></Link>
            </div>
            </div>: <Loader style={{color: 'white'}} active>Loading Tripss..</Loader>}
            </div>
        )
    }
}

export default Profile

