import React,{useState} from 'react'
import './index.css'
import Swal from 'sweetalert2'
import AWS from 'aws-sdk'
import Cookies from 'js-cookie'
import {URL as CUR_URL} from '../data'
import { Spinner } from 'react-bootstrap'

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
   const {details,isFreelance} = props 
//    console.log(details)
   const status = details.status+1
   const [isLoading,setIsLoading] = useState(true)
   const [pdfUrl,setPdfUrl] = useState(null)

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
                const delUrl = `${CUR_URL}/apply/${details.applicationId}`
                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
                const DataFetching = await fetch(delUrl, options)
                const DetailsOfUser = await DataFetching.json()
                if(DetailsOfUser.message){
                    Swal.fire({
                        title: "Withdrawn Successful",
                        text: "You have successfully withdrawn your application",
                        icon: "success"
                    });
                }
                
            }
      });
   }

   const viewPdf = async () => {
        try{
            const s3 = new AWS.S3({
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                region: process.env.REACT_APP_REGION,
            })
            const params = {
                Bucket: process.env.REACT_APP_BUCKET_NAME,
                Key : details.applicationId + '.pdf',
            }
            const data = await s3.getObject(params).promise()
            const pdfData = new Blob([data.Body],{type: 'application/pdf'})
            const url = URL.createObjectURL(pdfData)
            window.open(url,'_blank')
            setPdfUrl(url)
            setIsLoading(false)
        }
        catch(e){
            setIsLoading(false)
            console.error(e)
        }
   }
   
   const formatPostedOn = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
    }

    const companyName = !isFreelance? details.jobData && details.jobData.companyName:''
    const format = !isFreelance ? companyName.charAt(0).toUpperCase() + companyName.substring(1):''
    
   return (
        <div className='each-card'>

            <div>
          {isFreelance && <><h3>Status: <span className={`${styling[details.status+1]}`}>
           <span>
              {status===1?<i class="fa-solid fa-hourglass gap"></i>:status===2?<i class="fa-regular fa-circle-check gap"></i>:<i class="fa-regular fa-circle-xmark gap"></i>}
            </span> 
            {APPLICATION_STATUS[details.status+1]}</span></h3>
            <h1>{details.jobData.jobTitle}</h1></>}

          {!isFreelance && <div className='company-and-logo'>
            <img className="image-logo" src={details.jobData.companyLogo} alt="Company Logo"/>
            <span><h4>{format}</h4>
            <h1>{details.jobData.jobTitle}</h1>
            </span>
        </div>}
            <div className='details-job'>
                <h5 className='job-id'> <b>Applied On: </b> {formatPostedOn(new Date(details.appliedAt))} </h5>
                <h5 className='rec-id'><b>Posted By: {isFreelance?details.postedBy:"Team JobStreet"}</b></h5>
            </div>
            </div>
            <div className='buttons-latest'>
            <button className="btn-31 f-button" onClick={viewPdf}>
                
            {isLoading && <Spinner animation="border" color='red' size="md" />}
            <span className="text-container">
                <span className="text">View</span>
            </span>
        </button>
         {/* {pdfUrl && <iframe
          src={pdfUrl}
          width="100%"
          height="600"
          title="PDF Viewer"
          frameBorder="0"
        ></iframe>} */}
        <button className='delete' onClick={showalert}>
            <i class="fa-regular fa-trash-can can"></i>
        </button>
            </div>
        </div>
   )
}

export default EachApplied 