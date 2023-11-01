import React from 'react'
import "./style.css"

interface TagsProps {
    text: string, 
}

const Tags = (props: TagsProps) => {
    const {text } = props; 
    return (
        <div className='tags'>
            {text}
        </div>
    )
}

export default Tags;
