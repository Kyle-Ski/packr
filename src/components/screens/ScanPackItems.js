import React from 'react'
import ScanPackItem from './ScanPackItem'

class ScanPackItems extends React.Component{
    
    render(){
        return (
            this.props.items.map((item, key) => {
                return (
                    <ScanPackItem key={key} item={item} />
                )
            })
        
        )
    }
}  


export default ScanPackItems