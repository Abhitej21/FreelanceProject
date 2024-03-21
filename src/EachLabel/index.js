import React from 'react'
import './index.css'

const EachLabel = (props) => {
    return (
        <div className='input-container'>
            <label>{props.label}</label>
            <input type="text" className="input-box"/>
        </div>
    )
}

export default EachLabel