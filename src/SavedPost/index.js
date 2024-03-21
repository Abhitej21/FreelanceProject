import React,{useState,useEffect} from 'react';
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'
import Button from '../Button';



const SavedPost = props => {
  const {each} = props
  console.log(each)
//   const updatedEach = {
//         jobTitle: each.title,//ok
//         companyName: each.company_logo_url.split("/")[6].split("-")[0], //ok
//         jobSalary: each.package_per_annum, //ok
//         companyLogo: each.company_logo_url, //ok
//         jobType: each.employment_type, 
//         id: each.id,
//         jobDescription: each.job_description,
//         location: each.location,
//         rating: each.rating,
//   }
 
  return (
    <div className="Card">
      
        <div className='top-box'>
        
        <div className="companyLogoJobFlex">  
          <div>
            <img
              className="CompanyLogo"
              src={each.companyLogo}
              alt="company logo"
            />
          </div>
          <div className="ratingFlexJob">
            <h1 className="titleSmallScreens">{each.jobTitle}</h1>
            <p>
              <FaStar className="Star" />
              &nbsp;
              {each.rating}
            </p>
          </div>
        </div>
     

    <div className="left-items">
            <Button each={each}/>     
    </div>
       
        </div>
      
        <div className="packageFlex">
          <div className="locationFlexJob">
            <p>
              <IoLocationOutline />
              &nbsp;{each.location}
            </p>
            <p>
              <BsBriefcaseFill />
              &nbsp;{each.jobType}
            </p>
          </div>
          <p>{each.jobSalary}</p>
        </div>
        <hr />
        <h1>Description</h1>

        <p>{each.jobDescription}</p>
    </div>
  )
}
export default SavedPost 
