import React, { Component } from 'react'
import { Icon, Header, Segment, Divider, Loader } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
import BackpackItems from './BackpackItems'

const itemsByPackUrl = 'https://packr-database.herokuapp.com/items'
class Backpack extends Component{

    state={
        backpack: '',
        name: '',
        items: [],
    }

    fetchBackpack = () => {
        console.log(this.props.match)
        this.setState({backpack: this.props.match.params.id})
        fetch(`https://packr-database.herokuapp.com/packs/${this.props.match.params.id}/items`)
            .then(res => res.json())
            .then(res => {
                if(res.error){
                    alert(res.error)
                    return this.setState({error: res.error})
                } else {
                    this.setState({items: res.backpack.items, name: res.backpack.backpack_name})
                }
            })
    }

    componentDidMount(){
        this.fetchBackpack()
            // .then(() => {
            //     if(this.state.backpack > 2){
            //         this.setState({name: ['knife', 'glue', 'code']})
            //     } else {
            //         this.setState({name: ['tent', 'water bottle', 'code']})
            //     }
            // })
            // .catch(console.warn)
    }

    render () {
        const {items} = this.state
        return (
            <div>
                {items ? 
                <div>
                <MobileNav />
                    <Segment style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <Header as='h1'>
                            <Icon circular inverted name='users' size='huge' />
                            <Header.Content style={{ color: 'white' }} as='h3'>{this.state.name}</Header.Content>
                        </Header>
                    </Segment>
                    <Header style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }} as='h1'>Items:</Header>
                    <Divider />
                    <BackpackItems items={items} />
                    <div>
                        <Link to='/add-items'><button className='add-button create' style={{margin: '10px'}} onClick={(e) => {
                            // e.preventDefault()
                        }} ><Icon name='add' />Add Item</button></Link>
                        <Link to={`/scan-items/${this.state.backpack}`}><button className='add-button' onClick={(e) => {
                            // e.preventDefault()
                            console.log(this.state.backpack)
                        }} ><Icon name='camera' />Scan Pack</button></Link>
                    </div> 
                    </div>: <Loader active />}
            </div>

        )
    }
}

export default Backpack