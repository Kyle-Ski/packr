import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class ToggleButton extends Component {
  state = {}

  handleClick = () => {
      this.setState({ active: !this.state.active })
  }

  render() {
    const { active } = this.state

    return (
      <Button size={this.props.size} toggle={true} basic={this.props.basic} color={this.props.color} active={active} onClick={this.props.handleClick}>
        {this.props.text}
      </Button>
    )
  }
}

export default ToggleButton