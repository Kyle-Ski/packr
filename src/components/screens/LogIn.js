import React from 'react'
import { Image, Button, Input, Icon, Form, Message } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import logo from '../../PackrLogoPng.png'

const style = {
  form: {
      margin: '10px'
  },
  logo: {
      marginTop: '25px',
      // boxShadow: '2px 2px black'
  },
  page: {
    marginTop:'200px'
  }
}

const LogIn = ({test, warning}) => (
  <div style={style.page}>
  <Image src={logo} size='large' style={style.logo} />
  <Form style={style.form} className={warning} onSubmit={()=>console.log('submit')}>
    <Form.Input label='Email' placeholder='joe@schmoe.com' icon='at' />
    <Form.Input type='password' label='Password' placeholder='password' icon='lock' />
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Button size={`medium`} toggle={true} color={`olive`} ><Link to='profile'>Log In</Link></Button>
  </Form>

    <Button size={`medium`} toggle={true} basic={true} color={`black`} onClick={test}><Link to='/signup'>Sign Up</Link></Button>
  
  </div>
)

export default LogIn
