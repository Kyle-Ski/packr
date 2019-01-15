import React, { Component } from 'react'
import { Form, Select, Dropdown, Header, Divider, Icon, Loader, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

const allItemsUrl = 'https://packr-database.herokuapp.com/items'
const userPacksUrl = 'https://packr-database.herokuapp.com/users/'
const addItemsUrl = 'https://packr-database.herokuapp.com/pack_items/'

const style = {
    form: {
        marginLeft: '25vw',
    },
    button: {
        width: '140px',
    }
}

class AddItems extends Component{

    state={
        newitems: [{item_id: '', item_name: ''}],
        items : [],
        unStructuredItems: [],
        unStructuredPacks: [],
        packOptions: [],
        chosenPack: 0,
        warning: null
    }

    componentDidMount(){
        this.fetchItems()
            .then(this.structureItems)
            .then(res => this.setState({items: res}))
            .then(this.fetchUserPacks)
            .then(this.structurePacks)
            .catch(err => console.warn(err))
    }

    structureItems = () => {
        const items =  this.state.unStructuredItems.reduce((accum, item, i) => {
            let newObject = {key: i, text: item.name, value: item.id}
            accum.push(newObject)
            return accum
        },[])
        return items
    }

    structurePacks = () => {
        const packs =  this.state.unStructuredPacks.reduce((accum, item, i) => {
            let newObject = {key: i, text: item.backpack_name, value: item.backpack_id}
            accum.push(newObject)
            return accum
        },[])
        this.setState({packOptions: packs})
        return packs
    }

    addToPack = () => {
        return fetch(addItemsUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                'backpack_id': this.state.chosenPack.value,
                'item_id': this.state.newitems
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.error) return this.setState({warning: 'warning'})
            return this.setState({warning:'success'})
        })
        .catch(err => console.warn('post items error:', err))
    }

    fetchUserPacks = () => {
        return fetch(userPacksUrl + this.props.user.id)
            .then(res => res.json())
            .then(res =>{
                this.setState({unStructuredPacks: res.user[0].backpacks})
                return res
            })
            .catch(err => console.warn('fetch user packs error:',err))
    }

    fetchItems = () => {
        return fetch(allItemsUrl)
            .then(res=> res.json())
            .then(res => this.setState({unStructuredItems: res.items}))
    }

    handleAdditem =  (e) => {
        e.preventDefault()
        this.setState({
          newitems: this.state.newitems.concat([{item_id: '', item_name: ''}])
        })
      }

    handleChoosePack = (e) => {
       if(e.target.innerText!== undefined){
            const chosenPack = this.state.packOptions.filter(pac => {
                return pac.text === e.target.innerText
            })[0]
            this.setState({chosenPack: chosenPack})
        }
    }

      handleRemoveitem = (idx) => (e) => {
        e.preventDefault()
        this.setState({
        newitems: this.state.newitems.filter((s, sidx) => idx !== sidx)
        })
      }

      handleUseritemAdd = (idx) => (evt) => {
        if (!evt.target.type){
            const targetSpaces = evt.target.innerText
            const chosenItem = this.state.items.filter(item => item.text === targetSpaces)[0]  
            const items = this.state.newitems.map((item, sidx) => {
                if (idx !== sidx){
                    return item
                } else if (chosenItem){
                    return { ...item, item_id: chosenItem.value, item_name: chosenItem.text}
                } else {
                    return console.log('user add item else')
                }
            })
            
            this.setState({newitems: items})
        }   
      }

    render(){
        const {items} = this.state
        return (
            <div>
            <div>
                <MobileNav signOut={this.props.signOut}/>
            </div>
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: '10px'}} as='h1'>Add Items into a Backpack</Header>
            <Divider />
            <Form big style={style.form} className={this.state.warning}> 
                {items.length ?<div> <Form.Group widths='equal'>
                <div>
                    <Header style={{color: 'white'}} as='h4'>Choose A Backpack</Header>
                    <Form.Field
                        required
                        control={Select}
                        options={this.state.packOptions}
                        // label='Choose a Backpack:'
                        placeholder='Pack..'
                        onChange={this.handleChoosePack}
                    />
                    </div>
                    <div style={{paddingRight: '120px'}}>
                    <button onClick={this.addToPack} style={style.button} className='add-button create'>Add Items To {this.state.chosenPack ? this.state.chosenPack.text:''}</button>
                    <Link to='create-item-name'><button style={{width: '140px', backgroundColor:'#FD6041'}} className='add-button create'>Item Not Here? Create It!</button></Link>
                     </div>
                    {this.state.chosenPack ? <Message style={{marginRight: '30vw'}} success header='Item(s) added!' content={`The items have been added to ${this.state.chosenPack.text}`} />:''}
                        <Message
                            style={{marginRight: '30vw'}}
                            warning
                            header='Could you check something!'
                            list={[
                                'The Items may not have been added correctly.',
                            ]}
                        />
                        {this.state.newitems.map((item, idx) =>(
                            <div key={idx}>
                            <Header style={{color: 'white'}} as='h4'>Select an Item</Header>
                            <Form.Field required control={Dropdown} onChange={this.handleUseritemAdd(idx)} selection options={this.state.items} placeholder='Items..' />
                            {/* <Form.Field control={Button} color='red' onClick={this.handleRemoveitem(idx)}>- Item</Form.Field> */}
                            <button className='minus-button' onClick={this.handleRemoveitem(idx)}><Icon name='minus'/> Item</button>
                            </div>
                        ))
                        }
                        
                </Form.Group>
                <button style={{width:'140px', marginRight: '125px', backgroundColor: 'olive'}} className='add-button create' onClick={this.handleAdditem}><Icon name='plus' /> Another Item</button>
                </div> : <Loader active />}
            </Form>
            </div>
        )
    }
}

export default AddItems