import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'semantic-ui-react'

const style={
    link: {
        boxShadow: '1px 2px 0px 0px rgba(0,0,0,0)',
        width: '117px',
        color: 'white'
    }
}

const ProfilePacks = ({packs}) => packs.map((pac, key) => {
        return (
            <Card key={key} style={{backgroundColor: 'rgb(199, 199, 175, 0.8)', borderStyle: 'dashed', borderColor: 'rgb(125,100,1)'}}>
            <Card.Content>
            <i style={{color: 'white',textShadow: '-1px 0px 4px rgba(1, 1, 1)', float:'right'}} className="fas fa-hiking"></i>
            <Card.Header float='left'>
                {pac.backpack_name}
            </Card.Header>
            </Card.Content>
            <Card.Content extra>
            <Link to={`/backpack/${pac.backpack_id}`}><button style={style.link} className='add-button'>Inspect</button>   </Link>
            </Card.Content>
            </Card>
        )
    })


export default ProfilePacks