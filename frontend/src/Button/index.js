import React from 'react'
import {Link} from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'

const Button  = (props) => (
    <>
    <Link
        to={`/jobs/${props.each.id}`}
        className="BgForDetailsOfJobs"
        key={props.each.id}>
        <button class="btn-31" onClick={props.onClick}>
            <span class="text-container">
                <span class="text">View</span>
            </span>
        </button>
    </Link>
    
   
    </>
)


export default Button




