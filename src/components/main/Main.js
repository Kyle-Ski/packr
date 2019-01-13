import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import Login from '../screens/LogIn'
import Signup from '../screens/SignUp'
import Profile from '../screens/Profile'
import AddPack from '../screens/AddPack'
import AddItems from '../screens/AddItems'
import CreateItem from '../screens/CreateItem'
import BackPack from '../screens/Backpack'
import ScanPack from '../screens/ScanPack'
const signUpUrl = 'http://localhost:3222/users'
const loginUrl = 'http://localhost:3222/auth/login'
const addPackUrl = 'http://localhost:3222/packs'
class Main extends Component {

    state = {
        warning: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isAuthed: false,
        user: '',
        packName: '',
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
          'password': this.state.password,
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
              return this.setState({user: res, isAuthed: true, password: ''})
            }
          })
          .catch(this.generalError)
    }

    requireAuth = (nextState, replace, next) => {
      const query = nextState.location.query
      console.log('query', query)
    }


    signUp =(e) => {
      fetch(signUpUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password,
          'first_name': this.state.firstName,
          'last_name': this.state.lastName
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
              return this.setState({user: res.user, isAuthed: true, password: ''})
            }
          })
          .catch(this.generalError)

    }

    addPack = () => {
      fetch(addPackUrl ,{
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          'user_id': this.state.user.id,
          'name': this.state.packName
        }) 
      })
          .then(response => response.json())
          .then(res => {
            console.log('before if',res)
            if(res.error){
              console.log('error')
              return alert(res.error)
            } else {
              console.log('else', res)
              return res
            }
          })
          .catch(this.generalError)
    }

    signOut = () => {
      this.setState({
        warning: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isAuthed: false,
        user: '',
        packName: '',
      })
    }

  render() {
    const { isAuthed } = this.state
    return (
      <div >
      <Switch>
        <Route exact path="/" render={(props) => <Login {...props} handleChange={this.handleChange} logIn={this.logIn}/>} />
        <Route exact path="/signup" render={(props) => <Signup {...props} handleChange={this.handleChange} signUp={this.signUp}/>} />
        
        {isAuthed ?<div>
         <Route exact path="/profile" render={(props)=> <Profile {...props} user={this.state.user} signOut={this.signOut}/>} />
         <Route exact path="/add-pack" render={(props)=> <AddPack {...props} handleChange={this.handleChange} addPack={this.addPack}/>} signOut={this.signOut} />
         <Route exact path="/add-items" render={(props)=> <AddItems {...props} user={this.state.user} signOut={this.signOut}/>} />
         <Route exact path="/create-item" render={(props) => <CreateItem {...props}  signOut={this.signOut} />}/>
         <Route path="/backpack/:id" render={(props) => <BackPack {...props} signOut={this.signOut} />}/>
         <Route path="/scan-items/:id" render={(props) => <ScanPack {...props} signOut={this.signOut} />}/>
         </div>
        : <Loader style={{color: 'white'}} active>Loading..</Loader>}

        {/* <Route component={NoTfound} /> */}
    </Switch>
      </div>
    );
  }
}

export default Main;
