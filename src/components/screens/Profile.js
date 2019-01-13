import React, { Component } from 'react'
import { Icon, Header, Divider, Card, Loader } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
import ProfilePacks from './ProfilePacks'

const userPacksUrl = 'https://packr-database.herokuapp.com/users/'

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
        window.scrollTo(0,20)
        this.fetchUserPacks()
    }

    render(){
        const {packs} = this.state
        return(
            <div>
            <MobileNav signOut={this.props.signOut}/>
            {packs.length ?<div >
            
            <Header style={{color: 'white', marginTop: '60px', marginLeft: '55px'}} as='h1'>
            <Icon circular inverted name='users' size='huge'/>
            <Header.Content  as='h3'>{this.props.user.first_name} {this.props.user.last_name}</Header.Content>
            </Header>
            
            <Header style={{color: 'white', }} as='h1'>Backpacks:</Header>
            <Divider />
            <div >
            <Card.Group centered>
            <ProfilePacks packs={this.state.packs}/>
            </Card.Group>
            <Divider />
            <Link style={{color: 'white'}} to='add-pack'><button className='add-button create' style={{color: 'white'}} ><Icon name='add' />Add Pack</button></Link>
            </div>
            </div>: <Loader style={{color: 'white'}} active>Lading Packs..</Loader>}
            </div>
        )
    }
}

export default Profile

