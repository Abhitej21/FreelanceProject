import React,{useState} from 'react'
import './index.css'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import Apply from '../Apply'


const APPLICATION_STATUS = {
    1: 'Pending',
    2: 'Accepted',
    0: 'Rejected',
}

const styling = {
    1: 'pending',
    2: 'accepted',
    0:'rejected',
}

const EachApplied = (props) => {
   const {details} = props 
   console.log(details)
   const status = details.status+1
   const [isLoading,setIsLoading] = useState(true)

   const showalert = () => {
    Swal.fire({
        title: 'Withdraw Application',
        text: 'Are you sure you want to withdraw the application for this Job Post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Withdraw"
      }).then(async (result) => {
            if(result.isConfirmed){
                const jwtToken = Cookies.get('jwt_token')
                const delUrl = `http://localhost:8000/withdraw/${details.applicationId}`
                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
                const DataFetching = await fetch(delUrl, options)
                const DetailsOfUser = await DataFetching.json()
                // console.log(DetailsOfUser)
                Swal.fire({
                    title: "Withdrawn Successful",
                    text: "You have successfully withdrawn your application",
                    icon: "success"
                });
            }
      });
   }
   
   const formatPostedOn = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
    }
    
   return (
        <div className='each-card'>

            <div>
           <h3>Status: <span className={`${styling[details.status+1]}`}>
           <span>
              {status===1?<i class="fa-solid fa-hourglass gap"></i>:status===2?<i class="fa-regular fa-circle-check gap"></i>:<i class="fa-regular fa-circle-xmark gap"></i>}
            </span> 
            {APPLICATION_STATUS[details.status+1]}</span></h3>
            <h1>{details.jobData.jobTitle}</h1>
            <div className='details-job'>
                <h5 className='job-id'> <b>Applied On: </b> {formatPostedOn(new Date(details.appliedAt))} </h5>
                <h5 className='rec-id'><b>Posted By: {details.postedBy}</b></h5>
            </div>
            </div>
            <div className='buttons-latest'>
            <button className="btn-31 f-button">
            <span className="text-container">
                <span className="text">View</span>
            </span>
        </button>
        <button className='delete' onClick={showalert}>
            <i class="fa-regular fa-trash-can can"></i>
        </button>
            </div>
        </div>
   )
}

export default EachApplied 