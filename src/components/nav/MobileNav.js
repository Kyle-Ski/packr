import React, { Component } from 'react'
import { Icon, Menu, Segment } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
const style = {
    segment: {
        minHeight: '90vh'
    },
    page: {
      maxWidth: '95vw',
      marginLeft: '10px'
    }
}

export default class MobileNav extends Component {
  state = { activeItem: 'active' }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div style={style.page}>
        {/* <Segment style={style.segment}>
          <Main />
        </Segment> */}

        <Menu fixed='bottom' tabular>

          <Menu.Item name='1' active={activeItem === '1'} onClick={this.handleItemClick}>
          <Link to='/'>
            Sign In
            </Link>
          </Menu.Item>

          <Menu.Item name='active' active={activeItem === 'active'} onClick={this.handleItemClick}>
          <Link to='/signup'>
            Sign Up
            </Link>
          </Menu.Item>

          <Menu.Item name='3' active={activeItem === '3'} onClick={this.handleItemClick}>
            Profile
          </Menu.Item>

          <Menu.Menu position='right'>
            <Menu.Item
              name='new-tab'
              active={activeItem === 'new-tab'}
              onClick={this.handleItemClick}
            >
              <Icon name='add' />
              New Tab
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}