import React from 'react'
import './index.css'

import Apply from '../Apply' 


const JobElement = (props) => {
  const {job,recruiter} = props

  console.log("IM in job element")
   return (

    <>
  {/* MODAL   */}
  <div
    className="modal fade"
    id={"exampleModalCenter"+job.jobId}
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div className="modal-content my-modal">
        <div className="modal-header my-header">
          <h5 className="modal-title" id="exampleModalLongTitle">
            <b>Freelance Job Post</b>
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
          </button>
        </div>
        <div className="modal-body">
            <p><strong>{`Company Name: `}</strong>&nbsp;&nbsp;{job.companyName}</p>
            <p><strong>{`Job Title: `}</strong>&nbsp;&nbsp;{job.jobTitle}</p>
            <p><strong>{`Job Description: `}</strong>&nbsp;&nbsp;{job.jobDescription}</p>
            <p><strong>{`Job Experience: `}</strong>&nbsp;&nbsp;{job.jobExperience}</p>
            <p><strong>{`Job Mode: `}</strong>&nbsp;&nbsp;{job.jobMode}</p>
            <p><strong>{`Job Type: `}</strong>&nbsp;&nbsp;{job.jobType}</p>
            <p><strong>{`Job Scope: `}</strong>&nbsp;&nbsp;{job.jobScope}</p>
            <p><strong>Job Skills: </strong>&nbsp;&nbsp;{job.jobSkills.map(each => {
                return <span className='each-skill'>{each+" "}</span>
            })}</p>
            <p><strong>{`Salary Type: `}</strong>&nbsp;&nbsp;{job.salaryType}</p>
            <p><strong>{`Job Salary: `}</strong>&nbsp;&nbsp;{job.jobSalary}</p>
            <p><strong>{`Recruiter: `}</strong>&nbsp;&nbsp;{recruiter}</p>

        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>


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
           
             <button className="btn-31 f-button" type="button" data-toggle="modal" 
            data-target={"#exampleModalCenter"+job.jobId}>
             <span className="text-container">
                 <span className="text">View</span>
             </span>
         </button>
             <Apply id={job.jobId} isFreelance={true} each={job}/>
             </div>
            
         </div>
         {/* <p className='shine'><span className='shine-me'>NEW</span></p> */}
         </div>

    </>
   )
}

export default JobElement 