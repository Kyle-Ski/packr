import React from 'react'
import { Image, Form, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import logo from '../../PackrShadow2.png'

const style = {
    form: {
        margin: '10px',
        padding: '5vw'
    },
    logo: {
        marginTop: '10vh'
    },
    page: {
      padding: '10vw'
    }
}

const SignUp = () => (
  <div style={style.page}>
  <Image src={logo} size='large' style={style.logo} />
  <Form style={style.form} className={'warning'} onSubmit={()=>console.log('submit')}>
    <Form.Input label='First Name' placeholder='First Name...' icon='pencil alternate' />
    <Form.Input label='Last Name' placeholder='Last Name' icon='pencil alternate' />
    <Form.Input label='Email' placeholder='joe@schmoe.com' icon='envelope' />
    <Form.Input type='password' label='Password' placeholder='password' icon='lock' />
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Link to='profile'><button className='add-button' style={{color: 'lightgrey', backgroundColor: '#FD6041', border: '#FD6041', boxShadow: '1.75px 2px 0px 2px rgba(0,0,0,0.2)', width: '25vw'}}>Sign Up</button></Link>
  </Form>
  <Link style={{color: '#FD6041', textShadow: '-1px 0px 4px rgba(1, 1, 1)', fontWeight: '1000', fontSize:'20px'}} to='/'>Log In</Link>

  </div>
)

export default SignUp
