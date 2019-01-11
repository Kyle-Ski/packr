import React, { Component } from 'react'
import { Icon, Header, Segment, Divider, Card } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
import ProfilePacks from './ProfilePacks'

const userPacksUrl = 'http://localhost:3222/users/'

class Profile extends Component {

    state = {
        packs: [],
    }

    fetchUserPacks = () => {
        fetch(userPacksUrl + this.props.user.id)
            .then(res => res.json())
            .then(res =>{
                console.log('res', res.user[0].backpacks)
                this.setState({packs: res.user[0].backpacks})
                return res
            })
            .catch(err => console.warn('fetch user packs error:',err))
    }

    componentDidMount(){
        this.fetchUserPacks()
    }

    render(){
        return(
            <div>
            <MobileNav />
            <div >
            </div>
            
            
            <Header style={{color: 'white', marginTop: '60px', marginLeft: '55px'}} as='h1'>
            <Icon circular inverted name='users' size='huge'/>
            <Header.Content  as='h3'>Placeholder Name</Header.Content>
            </Header>
            
            <Header style={{color: 'white', }} as='h1'>Backpacks:</Header>
            <Divider />
            <div >
            <Card.Group centered>
            <ProfilePacks packs={this.state.packs}/>
            </Card.Group>
            <Divider />
            <Link to='add-pack'><button className='add-button create' ><Icon name='add' />Add Pack</button></Link>
            </div>
            </div>
        )
    }
}

export default Profile