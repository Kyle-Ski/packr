import React, { Component } from 'react'
import { Button, Form, Message, Divider, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

class AddPack extends Component{

    render(){
        return(
            <div>
            <div>
                <MobileNav />
            </div>
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}} as='h1'>Create A Pack</Header>
            <Divider />
            <Form className={'warning'} onSubmit={()=>console.log('submit')}>
            <Header as='h4' style={{color: 'white'}}>Pack Name</Header>
                <Form.Input placeholder='Pack Name...' icon='travel' />
                <Message success header='Form Completed' content="You're all signed up for the newsletter" />
                <Link to='add-items'><button className='add-button create' >+ Create Pack</button></Link>
            </Form>
            </div>
        )
    }
}

export default AddPack