import React from 'react'
import './index.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const Apply = (props) => {
    const {each,id} = props
    return (
        <Link className="link-button" to={`/apply/${id}`}>
        <button className='apply'>
            <span>APPLY</span>
        </button>
        </Link>
    )
}


export default Apply