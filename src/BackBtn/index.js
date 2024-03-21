import React from 'react'
import './index.css'
import { Link } from 'react-router-dom/cjs/react-router-dom'

const BackBtn = () => {
    return (
        <Link to="/jobs">
            <button type="button" className='back-button'>
            <i class="fa-solid fa-arrow-left" style={{marginRight: "5px"}}></i>
                Go Back
            </button>
        </Link>
        
    )
}

export default BackBtn