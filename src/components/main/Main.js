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
const initUrl = 'https://packr-database.herokuapp.com/'
const loginUrl = 'https://packr-database.herokuapp.com/auth/login'
const addPackUrl = 'https://packr-database.herokuapp.com/packs'
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
        loaded: false,
    }

    fetchInit = () => {
      
    }

    componentDidMount(){
      fetch(initUrl)
        .then(res => res.json())
        .then(res => {
          if (res.message){
            this.setState({loaded: true})
          }
          return res
        })
      .catch(err => console.warn('mount:', err))
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
              return this.setState({user: res, isAuthed: true, password: ''})
            }
          })
          .catch(this.generalError)
    }

    signUp =(e) => {

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

  render() {
    const {loaded, isAuthed} = this.state
    return (
      <div >
      <Switch>
        {loaded ? <div><Route exact path="/" render={(props) => <Login {...props} handleChange={this.handleChange} logIn={this.logIn}/>} />
        <Route exact path="/signup" render={(props) => <Signup {...props} handleChange={this.handleChange} signUp={this.signUp}/>} /></div> :<Loader active >Loading... if Packr is taking too long, refresh the page.</Loader>}
        {isAuthed ?
        <div>
         <Route exact path="/profile" render={(props)=> <Profile {...props} user={this.state.user} />} />
         <Route exact path="/add-pack" render={(props)=> <AddPack {...props} handleChange={this.handleChange} addPack={this.addPack}/>} />
         <Route exact path="/add-items" render={(props)=> <AddItems {...props} user={this.state.user}/>} />
         <Route exact path="/create-item" component={CreateItem} />
         <Route path="/backpack/:id" component={BackPack} />
         <Route path="/scan-items/:id" component={ScanPack} />
         </div>
        : <Loader active />}
        {/* <Route component={NoTfound} /> */}
    </Switch>
      </div>
    );
  }
}

export default Main;
