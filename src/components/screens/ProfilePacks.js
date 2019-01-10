import React from 'react'
import { Link } from 'react-router-dom'

const style={
    link: {
        color: 'white', 
        textShadow: '-1px 0px 4px rgba(1, 1, 1)', 
        backgroundColor: '#FD6041',
        fontSize: '20px',
        padding: '5px'
    }
}

const ProfilePacks = ({packs}) => packs.map((pac, key) => {
        return (
            <h2 key={key}><Link style={style.link} className='add-button' to={`/backpack/${pac.id}`}><i style={{color: 'white',textShadow: '-1px 0px 4px rgba(1, 1, 1)'}} className="fas fa-hiking"></i>   {pac.name}</Link></h2>
        )
    })


export default ProfilePacks