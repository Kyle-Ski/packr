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
        pass: '',
        firstName: '',
        lastName: '',
        isAuthed: false,
        user: '',
    }

    getEmail = (e) => this.setState({email: e.target.value})
    getPass = (e) => this.setState({pass: e.target.value})
    getFirstName = (e) => this.setState({firstName: e.target.value})
    getLastName = (e) => this.setState({lastName: e.target.value})

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
          .then(response => response.json())
          .then(res => {
            if(res.error){
              return alert(res.error)
            } else {
              this.setState({user: res[0], isAuthed: true})
            }
          })
      })
    }

    signUp =(e) => {

    }

  render() {
    return (
      <div >
      <Switch>
        <Route exact path="/" render={(props) => <Login {...props} getEmail={this.state.getEmail} getPass={this.state.getPass} logIn={this.logIn}/>} />
        <Route exact path="/signup" render={(props) => <Signup {...props} getEmail={this.state.getEmail} getPass={this.state.getPass} getFirstName={this.state.getFirstName} getLastName={this.state.getLastName} signUp={this.signUp}/>} />
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
