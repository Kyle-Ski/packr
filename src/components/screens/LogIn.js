import React, { Component } from 'react'
import { Image, Form, Message } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import shadow from '../../PackrShadow2.png'
import VideoRecorder from './VideoRecorder';

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

class LogIn extends Component{

render(){
  return (
  <div style={style.page}>
  <Image src={shadow} size='large' style={style.logo} />
  {/* <VideoRecorder /> */}
  <Form style={style.form} >
  <div onClick={() => window.scrollTo(0, 0)}>
    <Form.Input name='email' onChange={this.props.handleChange} label='Email' placeholder='example_packr@email.com..' icon='at' style={{color: 'darkblue'}} />
    </div>
    <Form.Input name='password' onChange={this.props.handleChange} type='password' label='Password' placeholder='Password..' icon='lock' style={{color: 'darkblue'}}/>
    <Message success header='Form Completed' content="You're all signed up for the newsletter" />
    <Link onClick={this.props.logIn} to='/profile'><button className='add-button' style={{color: 'lightgrey', backgroundColor: '#FD6041', border: '#FD6041', boxShadow: '1.75px 2px 0px 2px rgba(0,0,0,0.2)', width: '40vw'}}>LogIn</button></Link>
  </Form>

    <Link style={{color: 'skyblue', fontWeight: '1000',fontSize:'20px'}} to='/signup'>Sign Up</Link>
  </div>
)
}
}
export default LogIn
