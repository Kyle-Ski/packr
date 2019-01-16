import React, { Component } from 'react'
import { Input, Header, Icon } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

const createUrl = 'http://packr-database.herokuapp.com/items'

class CreateItemName extends Component {

    state={
        itemName: '',
        itemId: null 
    }

    getItemName = (e) => this.setState({itemName: e.target.value})

    sendItem =  () => {
        fetch(createUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                'name': this.state.itemName,
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.error){
                this.setState({warning: 'warning'})
                return res
            } else {
                this.setState({warning: 'success', itemId: res.item.id})
                return res
            }
        })
        .catch(err => console.warn(err))
    }
    render(){
        return (
            <div>
                <MobileNav />
                <div>
                <Header as='h1' style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: '150px', marginBottom: '40px'}}>What Is the Item's Name?</Header>
                <Input name='itemName' required onChange={this.props.handleChange} placeholder='Item Name...' icon='pencil alternate' />
                </div>
                <Link to='/create-item'><button style={{marginTop: '20px'}} className='add-button create' onClick={this.props.sendItem} ><Icon name='plus' /> Submit</button></Link>
            </div>
        )
    }
}

export default CreateItemName