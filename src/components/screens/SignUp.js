import React from 'react'
import { Image, Button, Input, Icon, Form, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import logo from '../../PackrLogoPng.png'

const style = {
    form: {
        margin: '10px'
    },
    logo: {
        marginTop: '25px'
    }
}

const SignUp = ({}) => (
  <div>
  <Image src={logo} size='large' style={style.logo} />
  <Form style={style.form} className={'warning'} onSubmit={()=>console.log('submit')}>
    <Form.Input label='First Name' placeholder='First Name...' icon='pencil alternate' />
    <Form.Input label='Last Name' placeholder='Last Name' icon='pencil alternate' />
    <Form.Input label='Email' placeholder='joe@schmoe.com' icon='envelope' />
    <Form.Input type='password' label='Password' placeholder='password' icon='lock' />
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Button size={`medium`} toggle={true} color={`olive`} ><Link to='profile'>Sign Up</Link></Button>
  </Form>
    <Button size={`medium`} toggle={true} basic={true} color={`green`} onClick={()=>console.log('test')}><Link to='/'> Log In</Link></Button>

  </div>
)

export default SignUp
