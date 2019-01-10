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
        warning: ''
    }

    test = () => {
        console.log('test')
        return true
    }

  render() {
    return (
      <div >
      {/* <Login test={this.test} warning={this.state.warning}/> */}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />
        <Route path="/add-pack" component={AddPack} />
        <Route path="/add-items" component={AddItems} />
        <Route path="/create-item" component={CreateItem} />
        <Route path="/backpack" component={BackPack} />
        {/* <Route component={NoTfound} /> */}
    </Switch>
      </div>
    );
  }
}

export default Main;
