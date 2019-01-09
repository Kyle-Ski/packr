import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from '../screens/LogIn'
import Signup from '../screens/SignUp'

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
      <div className="App">
      {/* <Login test={this.test} warning={this.state.warning}/> */}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        {/* <Route component={NoTfound} /> */}
    </Switch>
      </div>
    );
  }
}

export default Main;
