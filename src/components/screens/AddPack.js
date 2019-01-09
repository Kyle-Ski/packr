import React, { Component } from 'react'
import { Button, Form, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

class AddPack extends Component{

    render(){
        return(
            <div>
            <div>
                <MobileNav />
            </div>
            <Form className={'warning'} onSubmit={()=>console.log('submit')}>
                <Form.Input label='Pack Name' placeholder='Pack Name...' icon='travel' />
                <Message success header='Form Completed' content="You're all signed up for the newsletter" />
                <Button size={`medium`} toggle={true} color={`olive`} ><Link to='add-items'>Create Pack</Link></Button>
            </Form>
            </div>
        )
    }
}

export default AddPack