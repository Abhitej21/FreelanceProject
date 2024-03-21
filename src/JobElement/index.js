import React,{useState} from 'react'
import './index.css'

import Apply from '../Apply'
import Button from '../Button'

const JobElement = (props) => {
   const {job} = props 
   return (
    <div className="box-of-latest">
        <div className='each-card'>
            <div>
            <div style={{display: "flex"}}>
            <h1>{job.jobTitle}</h1>
            <span><img src="https://www.iconarchive.com/download/i85595/graphicloads/100-flat/new.ico" className="new-tag" alt="NEW"/></span></div>
            <div className='skills-section'>
                {job.jobSkills.map(eachSkill => <span className='skill-name'>{eachSkill}</span>)}
            </div>
            <div className='details-job'>
                <h5 className='job-id'> <b>Date: </b> {job.datePosted} </h5>
                <h5 className='location'> <b>Location: </b> {job.location} </h5>
                <h5 className='work-type'> <b>Work Type: </b> {job.jobType} </h5>
            </div>
            </div>
            <div className='buttons-latest'>
           
            <button className="btn-31 f-button">
            <span className="text-container">
                <span className="text">View</span>
            </span>
        </button>
            <Apply id={job.jobId} isFreelance={true} each={job}/>
            </div>
            
        </div>
        {/* <p className='shine'><span className='shine-me'>NEW</span></p> */}
        </div>
   )
}

export default JobElement 