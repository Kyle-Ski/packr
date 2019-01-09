import React, { Component } from 'react'
import { Image, Button, Icon, Header, Segment } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
class Profile extends Component {

    render(){
        return(
            <div>
            <MobileNav />
            <div >
            </div>
            <Segment>
            <Header as='h2'>
            <Icon circular inverted name='users' size='huge'/>
            <Header.Content as='h3'>Placeholder Name</Header.Content>
            </Header>
            </Segment>
            <Header as='h1'>Backpacks:</Header>
            <Header as='h2'>backpack list placehoder</Header>
            <Button color='green'><Icon name='add' /><Link to='add-pack'>Add Pack</Link></Button>
            </div>
        )
    }
}

export default Profile