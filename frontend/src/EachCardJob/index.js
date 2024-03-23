import React,{useState,useEffect} from 'react';
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Heart from "react-animated-heart";
import {FaStar} from 'react-icons/fa'
import './index.css'
import Button from '../Button';
import Apply from '../Apply';
// import { useNavigate } from 'react-router-dom';



const JobCard = props => {
  const {each,onHeartClick,isStarred} = props
  const [isClick, setClick] = useState(isStarred);

  const heartClicked = async () => {
     if(!isClick){
      onHeartClick(each.id,false)
        setClick(true)
     }
     else{
      onHeartClick(each.id,true)
        setClick(false)
     }
     
  }


  const formatPostedOn = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
 
  return (
    <div className="Card">
        <span style={{color: "white",fontWeight: "bold"}}>{`Posted on ${formatPostedOn(each.datePosted)}`}</span>
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
      <button onClick={heartClicked}>
          <Heart isClick={isStarred}/>
        </button>  
            <Button each={each}/> 
        <Apply id={each.id} isFreelance={false} each={each}/>
    </div>
       
        </div>
      
        <div className="packageFlex">
          <div className="locationFlexJob">
            <p className='icon'>
              <IoLocationOutline />
              &nbsp;{each.location}
            </p>
            <p className='icon'>
              <BsBriefcaseFill />
              &nbsp;{each.jobType}
            </p>
            <p className='icon'>
            <i class="fa-solid fa-map-location-dot"></i>
              &nbsp;{each.jobMode}
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
export default JobCard
