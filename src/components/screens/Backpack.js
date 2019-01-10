import React, { Component } from 'react'
import { Icon, Header, Segment, Divider, Loader } from 'semantic-ui-react'
import MobileNav from '../nav/MobileNav'
import { Link } from 'react-router-dom'
import BackpackItems from './BackpackItems'
class Backpack extends Component{

    state={
        backpack: '',
        name: ''
    }

    fetchBackpack = () => {
        this.setState({backpack: this.props.match.params.id})
        const id = this.props.match.params.id
        switch (id){
            case '1':
            this.setState({name: ['knife', 'glue', 'code']})
            break;
            case '2':
            this.setState({name: ['tent', 'waterbottle', 'code']})
            break;
            case '3':
            this.setState({name: ['hi', 'waterbottle', 'code']})
            break;
            case '4':
            this.setState({name: ['yes', 'waterbottle', 'code']})
            break;
            default: 
            this.setState({name: ['def', 'waterbottle', 'code']})
            break;
        }
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
        const {name} = this.state
        return (
            <div>
                {name ? 
                <div>
                <MobileNav />
                    <Segment style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <Header as='h1'>
                            <Icon circular inverted name='users' size='huge' />
                            <Header.Content style={{ color: 'white' }} as='h3'>Placeholder Name</Header.Content>
                        </Header>
                    </Segment>
                    <Header style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }} as='h1'>Items:</Header>
                    <Divider />
                    <BackpackItems items={this.state.name} />
                    <div >
                        <button className='add-button create' onClick={(e) => {
                            e.preventDefault()
                            console.log(this.state.backpack)
                        }} ><Icon name='add' />Add Item</button>

                    </div> 
                    </div>: <Loader active />}
            </div>

        )
    }
}

export default Backpack