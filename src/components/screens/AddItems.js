import React, { Component } from 'react'
import { Form, Select, Dropdown, Header, Divider, Icon, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

const allItemsUrl = 'http://localhost:3222/items'

const style = {
    form: {
        marginLeft: '25vw',
    },
    button: {
        marginRight: '31vw'
    }
}

class AddItems extends Component{

    state={
        newAuthors: [{firstName: '', lastName: '', id: ''}],
        items : [],
        unStructuredItems: [],
        packOptions: [
            {
                key: 0,
                text: '7 Day',
                value: 1
            },
            {
                key: 1,
                text: 'Hiking',
                value: 2
            },
            {
                key: 2,
                text: 'Cold Weather',
                value: 3
            },
            {
                key: 3,
                text: 'Day',
                value: 4
            },
        ]
    }

    componentDidMount(){
        this.fetchItems()
            .then(this.structureItems)
            .then(res => this.setState({items: res}))
            .catch(err => console.warn(err))
    }

    structureItems = () => {
        const items =  this.state.unStructuredItems.reduce((accum, item, i) => {
            let newObject = new Object()
            newObject["key"] = i
            newObject["text"] = item.name
            newObject["value"] = item.id
            accum.push(newObject)
            return accum
        },[])
        console.log('items',items)
        return items
    }

    fetchItems = () => {
        return fetch(allItemsUrl)
            .then(res=> res.json())
            .then(res => this.setState({unStructuredItems: res.items}))
    }

    handleAddAuthor =  (e) => {
        e.preventDefault()
        this.setState({
          newAuthors: this.state.newAuthors.concat([{firstName: '', lastName: '', id: ''}])
        })
      }

      handleRemoveAuthor = (idx) => (e) => {
        e.preventDefault()
        this.setState({
        newAuthors: this.state.newAuthors.filter((s, sidx) => idx !== sidx)
        })
      }

      handleUserAuthorAdd = (idx) => (evt) => {
        if (!evt.target.type){
          const targetSpaces = evt.target.innerText
          const noTargetSpaces = targetSpaces.replace(/\s/g,'')
          const chosenItem = this.state.items.filter(author => {
            // let spaces =`${author.firstName} ${author.lastName}` 
            // let noSpaces = spaces.replace(/\s/g,'')
            return author === targetSpaces
          })[0]  
          const authors = this.state.newAuthors.map((author, sidx) => {
            if (idx !== sidx){
              return author
            } else {
              return { ...author, firstName: chosenItem, lastName: chosenItem, id: chosenItem, }
            }
          })
          
          this.setState({newAuthors: authors})
        }   
      }

    render(){
        const {items} = this.state
        return (
            <div>
            <div>
                <MobileNav />
            </div>
            <Header style={{color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'}} as='h1'>Add Items into a Backpack</Header>
            <Divider />
            <Form style={style.form}>
                {items.length ?<div> <Form.Group widths='equal'>
                <div>
                    <Header style={{color: 'white'}} as='h4'>Choose A Backpack</Header>
                    <Form.Field
                        control={Select}
                        options={this.state.packOptions}
                        // label='Choose a Backpack:'
                        placeholder='Pack..'
                    />
                    
                     <button className='add-button create' onClick={this.handleAddAuthor}><Icon name='plus' /> Another Item</button>
                     </div>
                        {this.state.newAuthors.map((author, idx) =>(
                            <div key={idx}>
                            <Header style={{color: 'white'}} as='h4'>Select an Item</Header>
                            <Form.Field control={Dropdown} onChange={this.handleUserAuthorAdd(idx)} selection options={this.state.items} placeholder='Items..' />
                            {/* <Form.Field control={Button} color='red' onClick={this.handleRemoveAuthor(idx)}>- Item</Form.Field> */}
                            <button className='minus-button' onClick={this.handleRemoveAuthor(idx)}><Icon name='minus'/> Item</button>
                            </div>
                        ))
                        }

                </Form.Group>
                <button style={style.button} className='add-button create'>Submit</button></div> : <Loader active />}
            </Form>
            </div>
        )
    }
}

export default AddItems