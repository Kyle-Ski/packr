import React from 'react'
import ScanPackItem from './ScanPackItem'
import { Loader } from 'semantic-ui-react'

class ScanPackItems extends React.Component{

    state = {
        items: this.props.items
    }

    componentDidMount(){
        this.structureItems()
    }

    structureItems = () => {
        const newItems =  this.props.items.reduce((accum, item, i) => {
            let newObject = new Object()
            newObject["item_name"] = item.item_name
            newObject["item_id"] = item.item_id
            newObject["isFliped"] = 'card'
            accum.push(newObject)
            return accum
        },[])
        this.setState({items: newItems})
        return newItems
    }

    test = (id) => {
        const matchedItem = this.state.items.filter((item, index) => {
            return index === id
        })[0]
        const itemIndex = this.state.items.indexOf(matchedItem)
        const newItem = {item_name: matchedItem.item_name, item_id: matchedItem.item_id, isFlipped: 'card is-fliped'}
        const newState = this.state.items
        newState[itemIndex] = newItem
        this.setState({items: newState})
    }

    render(){
        const {items} = this.state
        if(items){
            return items.map((item, index) => {
                    return (
                        <div key={index} onClick={this.test.bind(this,index)}>
                        <ScanPackItem item={item} />
                        </div>
                    )
                })
            
        } else {
            return <Loader active />
        }
    }
}  


export default ScanPackItems