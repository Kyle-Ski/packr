import React from 'react'

const ProfilePacks = ({packs}) => packs.map((pac, key) => {
        return (
            <h2 style={{color: 'white'}} key={key}><a href='/backpack'>{pac.name}</a></h2>
        )
    })


export default ProfilePacks