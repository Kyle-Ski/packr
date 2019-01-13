import React, { Component } from 'react'
import { Form, Message, Divider, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

class AddPack extends Component{

    render(){
        return(
            <div>
            <div>
                <MobileNav signOut={this.props.signOut}/>
            </div>
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}} as='h1'>Create A Pack</Header>
            <Divider />
            <Form style={{margin: '10vw'}} className={'warning'} onSubmit={()=>console.log('submit')}>
            <Header as='h4' style={{color: 'white'}}>Pack Name</Header>
                <Form.Input name='packName' placeholder='Pack Name...' icon='travel' onChange={this.props.handleChange} />
                <Message success header='Form Completed' content="You're all signed up for the newsletter" />
                <Link onClick={this.props.addPack} to='add-items'><button style={{width:'140px'}} className='add-button create' ><Icon name='plus' /> Create Pack</button></Link>
            </Form>
            </div>
        )
    }
}

export default AddPack