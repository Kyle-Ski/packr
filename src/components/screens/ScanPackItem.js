import React from 'react'
import { Icon } from 'semantic-ui-react'

class ScanPackItem extends React.Component {

    state = {
        name: 'card',
        flipOrder: []
    }

    handleFlip = (e) => {
        if(this.state.name === 'card'){
            this.setState({name: 'card is-fliped'})
        } else if (this.state.name === 'card is-fliped'){
            this.setState({name: 'card'})
        } else {
            console.log('else')
        }
    }

    componentDidMount(){
        this.setState({name: this.props.item.isFlipped})
    }

    componentWillReceiveProps(nextProps){
        if(this.props.item.isFliped !== nextProps.item.isFliped){
            this.setState({name: nextProps.item.isFliped})
        } 
    }

    render(){
        const {name} = this.state
        return (
            <div className='scene'>
                <div className={name}>
                    <h2 className='item__face item__face--front' ><Icon className='item__face item__face--front' name='search' /> {this.props.item.item_name}</h2>
                    <h2 className='item__face item__face--back' ><Icon name='check' /> {this.props.item.item_name}</h2>
                </div>
            </div>
        )
    }
}

export default ScanPackItem