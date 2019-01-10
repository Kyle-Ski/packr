import React, { Component } from 'react'
import { Image, Button, Icon, Header, Segment, Divider } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'

const style = {
    page: {
    marginTop:'100px'
  },
//   button: {
//       backgroundColor: '#528781',
//       border: 'solid 2px #528781',
//       height: '40px',
//       borderRadius: '5px',
//       boxShadow: 'black 2px'
//   }
}
class Profile extends Component {

    render(){
        return(
            <div>
            <MobileNav />
            <div >
            </div>
            <Divider />
            <Segment>
            <Header as='h2'>
            <Icon circular inverted name='users' size='huge'/>
            <Header.Content as='h3'>Placeholder Name</Header.Content>
            </Header>
            </Segment>
            <Header as='h1'>Backpacks:</Header>
            <Divider />
            <div style={style.page}>
            <Header as='h2'>backpack 1</Header>
            <Header as='h2'>backpack 2</Header>
            <Header as='h2'>backpack 3</Header>
            <Header as='h2'>backpack 4</Header>
            <Divider />
            <Link to='add-pack'><button className='add-button' ><Icon name='add' />Add Pack</button></Link>
            </div>
            </div>
        )
    }
}

export default Profile