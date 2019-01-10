import React from 'react'
import { Image, Form, Message } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import shadow from '../../PackrShadow2.png'

const style = {
  form: {
      margin: '10px',
      padding: '5vw'
  },
  logo: {
      marginTop: '25px',
      // boxShadow: '2px 2px black'
  },
  page: {
    marginTop:'100px',
    padding: '10vw'
  }
}

const LogIn = ({test, warning}) => (
  <div style={style.page}>
  <Image src={shadow} size='large' style={style.logo} />
  <Form style={style.form} className={warning} onSubmit={()=>console.log('submit')}>
    <Form.Input label='Email' placeholder='example_packr@email.com..' icon='at' style={{color: 'darkblue'}} />
    <Form.Input type='password' label='Password' placeholder='Password..' icon='lock' style={{color: 'darkblue'}}/>
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Link to='profile'><button className='add-button' style={{color: 'lightgrey', backgroundColor: '#FD6041', border: '#FD6041', boxShadow: '1.75px 2px 0px 2px rgba(0,0,0,0.2)', width: '25vw'}}>LogIn</button></Link>
  </Form>

    <Link style={{color: '#FD6041', textShadow: '-1px 0px 4px rgba(1, 1, 1, 1)', fontWeight: '1000',fontSize:'20px'}} to='/signup'>Sign Up</Link>
  
  </div>
)

export default LogIn
