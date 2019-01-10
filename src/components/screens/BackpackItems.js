import React from 'react'

const BackpackItems = ({items}) => items.map((pac, key) => {
        return (
            <h2 style={{color: 'white'}} key={key}>{pac.item_name}</h2>
        )
    })


export default BackpackItems