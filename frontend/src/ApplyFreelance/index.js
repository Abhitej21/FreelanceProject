import React from 'react'
import './index.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const ApplyFreelance = (props) => {
    const {each} = props
    const {id} = each 
    return (
        <Link className="link-button" to={`/apply/${each.jobId}`}>
            
            <button className='apply'>
                <span>APPLY</span>
            </button>
        </Link>
    )
}


export default ApplyFreelance