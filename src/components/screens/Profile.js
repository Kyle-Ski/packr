import React, { Component } from 'react'
import { Image, Button, Icon, Header, Segment, Divider } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
import ProfilePacks from './ProfilePacks'

class Profile extends Component {

    state = {
        packs: [
            {
                name: '7 Day',
                id: 1
            },
            {
                name: 'Hiking',
                id: 1
            },
            {
                name: 'Cold Weather',
                id: 1
            },
            {
                name: 'Day',
                id: 1
            }
        ]
    }

    render(){
        return(
            <div>
            <MobileNav />
            <div >
            </div>
            
            <Segment style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <Header as='h1'>
            <Icon circular inverted name='users' size='huge'/>
            <Header.Content style={{color: 'white'}} as='h3'>Placeholder Name</Header.Content>
            </Header>
            </Segment>
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}} as='h1'>Backpacks:</Header>
            <Divider />
            <div >
            <ProfilePacks packs={this.state.packs}/>
            <Divider />
            <Link to='add-pack'><button className='add-button create' ><Icon name='add' />Add Pack</button></Link>
            </div>
            </div>
        )
    }
}

export default Profile