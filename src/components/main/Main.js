import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../screens/LogIn'
import Signup from '../screens/SignUp'
import Profile from '../screens/Profile'
import AddPack from '../screens/AddPack'
import AddItems from '../screens/AddItems'
import CreateItem from '../screens/CreateItem'
import BackPack from '../screens/Backpack'

const loginUrl = 'http://localhost:3222/auth/login'
class Main extends Component {

    state = {
        warning: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isAuthed: false,
        user: '',
    }

    generalError = (err) => {
      this.setState({error: true})
      return console.warn('General Error:',err)
    }

    handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    logIn = (e) => {
      fetch(loginUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password
        }) 
      })
          .then(response => response.json())
          .then(res => {
            console.log('before if',res)
            if(res.error){
              console.log('error')
              return alert(res.error)
            } else {
              console.log('else')
              return this.setState({user: res[0], isAuthed: true})
            }
          })
          .catch(this.generalError)
      
    }

    signUp =(e) => {

    }

  render() {
    
    return (
      <div >
      <Switch>
        <Route exact path="/" render={(props) => <Login {...props} handleChange={this.handleChange} logIn={this.logIn}/>} />
        <Route exact path="/signup" render={(props) => <Signup {...props} handleChange={this.handleChange} signUp={this.signUp}/>} />
        {this.state.isAuthed && <Route exact path="/profile" component={Profile} />}
        {this.state.isAuthed && <Route exact path="/add-pack" component={AddPack} />}
        {this.state.isAuthed && <Route exact path="/add-items" component={AddItems} />}
        {this.state.isAuthed && <Route exact path="/create-item" component={CreateItem} />}
        {this.state.isAuthed && <Route path="/backpack/:id" component={BackPack} />}
        {/* <Route component={NoTfound} /> */}
    </Switch>
      </div>
    );
  }
}

export default Main;
