import React, { Component } from 'react'
import { Menu, Dropdown, Image } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import logo from '../../PackrShadow2.png'
const style = {
    logo: {
      marginTop: '3px',
      maxWidth: '368px',
      maxHeight: '35px',
      width: 'auto',
      height: 'auto'
    },
    menu: {
      maxHeight: '42px',
      backgroundColor: 'grey !important',
      border: 'grey !important'
    },
    altMenu: {
      padding: '10px',
    }
}

export default class MobileNav extends Component {
  state = { activeItem: 'active' }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div style={{marginBottom: '42px'}}>
        {/* <Segment style={style.segment}>
          <Main />
        </Segment> */}
        <Menu style={style.menu} fixed='top' attached='top' >
      <Dropdown item icon='bars' simple>
        <Dropdown.Menu>
          <Dropdown.Item><Link style={{color:'black'}} to='/'>Sign Out</Link></Dropdown.Item>
          <Dropdown.Item><Link style={{color:'black'}} to='/profile'>Profile</Link></Dropdown.Item>
          <Dropdown.Item><Link style={{color:'black'}} to='/create-item'>Create Item</Link></Dropdown.Item>
          <Dropdown.Item><Link style={{color:'black'}} to='/add-items'>Add Items</Link></Dropdown.Item>
          <Dropdown.Item><Link style={{color:'black'}} to='/add-pack'>Add Pack</Link></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Image src={logo} style={style.logo} centered size='tiny'/>
      </Menu>
      </div>
    )
  }
}