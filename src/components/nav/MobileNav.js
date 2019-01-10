import React, { Component } from 'react'
import { Icon, Menu, Segment, Dropdown, Image } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import logo from '../../PackrLogoPng.png'
const style = {
    logo: {
      marginTop: '3px',
      maxWidth: '368px',
      maxHeight: '35px',
      width: 'auto',
      height: 'auto'
    },
    menu: {
      maxHeight: '42px'
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
        <Menu style={style.menu} fixed='top' attached='top'>
      <Dropdown item icon='bars' simple>
        <Dropdown.Menu>
          <Dropdown.Item><Link to='/'>Sign Out</Link></Dropdown.Item>
          <Dropdown.Item><Link to='profile'>Profile</Link></Dropdown.Item>
          <Dropdown.Item><Link to='create-item'>Create Item</Link></Dropdown.Item>
          <Dropdown.Item><Link to='add-items'>Add Items</Link></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Export</Dropdown.Header>
          <Dropdown.Item>Share</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Image src={logo} style={style.logo} centered size='tiny'/>
      </Menu>
      </div>
    )
  }
}