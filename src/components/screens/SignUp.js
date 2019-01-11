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

const SignUp = ({handleChange}) => (
  <div style={style.page}>
  <Image src={logo} size='large' style={style.logo} />
  <Form style={style.form} className={'warning'} onSubmit={()=>console.log('submit')}>
    <Form.Input name='firstName' label='First Name' placeholder='First Name...' icon='pencil alternate' onChange={handleChange}/>
    <Form.Input name='lastName' label='Last Name' placeholder='Last Name' icon='pencil alternate' onChange={handleChange}/>
    <Form.Input name='email' label='Email' placeholder='joe@schmoe.com' icon='envelope' onChange={handleChange}/>
    <Form.Input name='password' type='password' label='Password' placeholder='password' icon='lock' onChange={handleChange}/>
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Link to='profile'><button className='add-button' style={{color: 'lightgrey', backgroundColor: '#FD6041', border: '#FD6041', boxShadow: '1.75px 2px 0px 2px rgba(0,0,0,0.2)', width: '40vw'}}>Sign Up</button></Link>
  </Form>
  <Link style={{color: 'skyblue', fontWeight: '1000',fontSize:'20px'}} to='/'>Log In</Link>

  </div>
)

export default SignUp
