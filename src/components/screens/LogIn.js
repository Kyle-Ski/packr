import React from 'react'
import { Image, Button, Input, Icon, Form, Message } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import shadow from '../../PackrShadow1.png'

const style = {
  form: {
      margin: '10px'
  },
  logo: {
      marginTop: '25px',
      // boxShadow: '2px 2px black'
  },
  page: {
    marginTop:'200px',
  }
}

const LogIn = ({test, warning}) => (
  <div style={style.page}>
  <Image src={shadow} size='large' style={style.logo} />
  <Form style={style.form} className={warning} onSubmit={()=>console.log('submit')}>
    <Form.Input label='Email' placeholder='joe@schmoe.com' icon='at' style={{color: 'darkblue'}} />
    <Form.Input type='password' label='Password' placeholder='password' icon='lock' style={{color: 'darkblue'}}/>
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Link to='profile'><button className='add-button' style={{color: 'lightgrey', backgroundColor: '#FD6041', border: '#FD6041', boxShadow: '1.75px 2px 0px 2px rgba(0,0,0,0.2)', width: '25vw'}}>LogIn</button></Link>
  </Form>

    <Link style={{color: '#FD6041'}} to='/signup'>Sign Up</Link>
  
  </div>
)

export default LogIn
