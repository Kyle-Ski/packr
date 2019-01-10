import React, { Component } from 'react'
import { Icon, Header, Segment, Divider } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'

class Backpack extends Component{

    render () {
        return (
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
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}} as='h1'>Items:</Header>
            <Divider />
            <div >
            <Link to='add-items'><button className='add-button create' ><Icon name='add' />Add Item</button></Link>
            </div>
            </div>

        )
    }
}

export default Backpack