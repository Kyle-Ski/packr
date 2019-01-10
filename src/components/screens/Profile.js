import React, { Component } from 'react'
import { Icon, Header, Segment, Divider } from 'semantic-ui-react'
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
            
            <Segment style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <Header as='h1'>
            <Icon circular inverted name='users' size='huge'/>
            <Header.Content style={{color: 'white'}} as='h3'>Placeholder Name</Header.Content>
            </Header>
            </Segment>
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}} as='h1'>Backpacks:</Header>
            <Divider />
            <div >
            <ProfilePacks packs={this.state.packs}/>
            <Divider />
            <Link to='add-pack'><button className='add-button create' ><Icon name='add' />Add Pack</button></Link>
            </div>
            </div>
        )
    }
}

export default Profile