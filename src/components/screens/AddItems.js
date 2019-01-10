import React, { Component } from 'react'
import { Button, Form, Message, Select, Dropdown, Header, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MobileNav from '../nav/MobileNav'

const style = {
    form: {
        marginLeft: '25vw',
    },
    button: {
        marginRight: '25vw'
    }
}

class AddItems extends Component{

    state={
        newAuthors: [{firstName: '', lastName: '', id: ''}],
        dropdownOptions : [
            {
                key: 0,
                text: 'Knife',
                value: 1
            },
            {
                key: 1,
                text: 'Water',
                value: 2
            },
            {
                key: 2,
                text: 'Code',
                value: 3
            },
            {
                key: 3,
                text: 'Fuel',
                value: 4
            },
        ],
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
          const chosenItem = this.state.dropdownOptions.filter(author => {
            // let spaces =`${author.firstName} ${author.lastName}` 
            // let noSpaces = spaces.replace(/\s/g,'')
            return author == targetSpaces
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
        return (
            <div>
            <div>
                <MobileNav />
            </div>
            <Header as='h1'>Add Items into a Backpack</Header>
            <Divider />
            <Form style={style.form}>
                <Form.Group widths='equal'>
                <div>
                    <Form.Field
                        control={Select}
                        options={this.state.packOptions}
                        label='Choose a Backpack:'
                        placeholder='Pack..'
                    />
                    
                     <button className='add-button' onClick={this.handleAddAuthor}>+ Another Item</button>
                     </div>
                        {this.state.newAuthors.map((author, idx) =>(
                            <div>
                            <Form.Field control={Dropdown} onChange={this.handleUserAuthorAdd(idx)} selection options={this.state.dropdownOptions} label='Select an Item' placeholder='Items..' />
                            {/* <Form.Field control={Button} color='red' onClick={this.handleRemoveAuthor(idx)}>- Item</Form.Field> */}
                            <button className='minus-button' onClick={this.handleRemoveAuthor(idx)}>- Item</button>
                            </div>
                        ))
                        }

                </Form.Group>
                <button style={style.button} className='add-button'>Submit</button>
            </Form>
            </div>
        )
    }
}

export default AddItems