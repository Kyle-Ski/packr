import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../screens/LogIn'
import Signup from '../screens/SignUp'
import Profile from '../screens/Profile'
import AddPack from '../screens/AddPack'
import AddItems from '../screens/AddItems'
import CreateItem from '../screens/CreateItem'
import BackPack from '../screens/Backpack'
class Main extends Component {

    state = {
        warning: '',
        email: '',
        pass: '',
        firstName: '',
        lastName: '',
    }

    getEmail = (e) => this.setState({email: e.target.value})
    getPass = (e) => this.setState({pass: e.target.value})
    getFirstName = (e) => this.setState({firstName: e.target.value})
    getLastName = (e) => this.setState({lastName: e.target.value})

    logIn = (e) => {
      
    }

  render() {
    return (
      <div >
      {/* <Login test={this.test} warning={this.state.warning}/> */}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/add-pack" component={AddPack} />
        <Route exact path="/add-items" component={AddItems} />
        <Route exact path="/create-item" component={CreateItem} />
        <Route path="/backpack/:id" component={BackPack} />
        {/* <Route component={NoTfound} /> */}
    </Switch>
      </div>
    );
  }
}

export default Main;
