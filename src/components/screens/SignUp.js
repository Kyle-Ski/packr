import React from 'react'
import { Image, Button, Input, Icon, Form, Message } from 'semantic-ui-react'
import logo from '../../PackrLogoPng.png'
import MobileNav from '../nav/MobileNav'

const SignUp = ({}) => (
  <div>
  <Image src={logo} size='large'  />
  <Form className={'warning'} onSubmit={()=>console.log('submit')}>
    <Form.Input label='First Name' placeholder='First Name...' icon='pencil alternate' />
    <Form.Input label='Last Name' placeholder='Last Name' icon='pencil alternate' />
    <Form.Input label='Email' placeholder='joe@schmoe.com' icon='envelope' />
    <Form.Input type='password' label='Password' placeholder='password' icon='lock' />
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Button size={`medium`} toggle={true} color={`olive`} >Log In</Button>
  </Form>
    <Button size={`medium`} toggle={true} basic={true} color={`green`} onClick={()=>console.log('test')}>Sign Up</Button>
    <MobileNav />

  </div>
)

export default SignUp
