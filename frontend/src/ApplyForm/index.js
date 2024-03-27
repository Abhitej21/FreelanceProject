import React,{useEffect,useState} from 'react'
import Spinner from 'react-bootstrap/Spinner';
import Cookies from 'js-cookie';
import './index.css'
import Swal from 'sweetalert2'
import {  useParams,useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Loader from 'react-loader-spinner';
import axios from 'axios'
import MainHeader from '../MainHeader';

const ApplyForm = () => {
    const {id} = useParams()
    const history = useHistory()
    const [defaultDetails,setDefaultDetails] = useState({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      jobTitle: "",
      location: "",
      companyName: "",
      startDate: "",
      resume: "",
    })
    const [isLoading,setIsLoading] = useState(true)
    const [submitLoading,setSubmitLoading] = useState(false)
    const [applied,setApplied] = useState(false)
    useEffect(() => {
      async function fetchDefault(){
          const jwtToken = Cookies.get('jwt_token')
          const newUrl = `http://localhost:8000/apply/${id}`
          const options = {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${jwtToken}`,
              },
          }
          const DataFetching = await fetch(newUrl, options)
          const DetailsOfUser = await DataFetching.json()
          if(DetailsOfUser.applied === true){
            setIsLoading(false)
            setApplied(true)
            return
          }
          setIsLoading(false)
          setDefaultDetails({...defaultDetails,
            firstname: DetailsOfUser.prevData.firstName,
            lastname: DetailsOfUser.prevData.lastName,
            phone: DetailsOfUser.prevData.phone,
            email: DetailsOfUser.prevData.email,
            jobTitle: DetailsOfUser.jobTitle,
            location: DetailsOfUser.location,
            companyName: DetailsOfUser.companyName,
          })
      }
      fetchDefault()
  },[])

  const changeDate = event => {
    setDefaultDetails({...defaultDetails,
      startDate: event.target.value
    })
  }
  

  const handleResume = event => {
    setDefaultDetails({...defaultDetails,
    resume: event.target.files[0]
    })
  }


  useEffect(() =>  {
    if(applied){
      {Swal.fire({
        title: "<strong>Submission done!</strong>",
        icon: "info",
        html: `
          You have already submitted your application for this
          job post.
        `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: `
          <i class="fa fa-thumbs-up"></i> Ok!
        `,
        confirmButtonAriaLabel: "Thumbs up, great!",
      }).then((result) => {
        if(result.isConfirmed){
          history.push('/jobs/latest')
        }
      })}
    }
  },[applied])

  // const handleResume = (e) => {

  // }

  const submitApply = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    const formData = new FormData();
    formData.append('startDate',defaultDetails.startDate);
    formData.append('resume',defaultDetails.resume);
    // console.log(formData)
    const jwtToken = Cookies.get('jwt_token')
     const {startDate,resume } = defaultDetails
     
     const applyUrl = `http://localhost:8000/apply/${id}`
     const newDetails = {
      startDate,
      resume,
     }
    //  console.log(resume)
     const axiosConfig = {
      headers: {
        'Authorization': `Bearer ${jwtToken}`, 
        'Content-Type': 'multipart/form-data', 
      },
    };
     axios.post(applyUrl,formData,axiosConfig).then(response => {
      setSubmitLoading(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Application Submitted Successfully",
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        history.push('/jobs/applied')
      },1000);
        // alert("Application Submitted Successfully")
        
        }).catch(error => {
          console.log(error);
        })
  }
  const {firstname,lastname,phone,email,jobTitle,startDate,companyName,location} = defaultDetails
    if(isLoading){
      return <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
    }
    return (
        <>
        <MainHeader/>
        {!applied &&
       <div className="formbold-main-wrapper">
          <div className="formbold-form-wrapper">
            <img className="formbold-img" src="https://t3.ftcdn.net/jpg/03/13/59/86/360_F_313598658_3TUnxxAvA2v4oDdcAKAYVh15782FcrtW.jpg" />
            <p className='applying-for'>{`Applying for ${jobTitle} at ${companyName}, ${location}`}</p>
            <form onSubmit={submitApply}>
              <div className="formbold-input-flex">
                <div>
                  <label htmlFor="firstname" className="formbold-form-label">
                    {" "}
                    First Name{" "}
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={firstname}
                    disabled={firstname!==""}
                    placeholder="Your first name"
                    className="formbold-form-input"
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="formbold-form-label">
                    {" "}
                    Last Name{" "}
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={lastname}
                    disabled={lastname!==""}
                    placeholder="Your last name"
                    className="formbold-form-input"
                  />
                </div>
              </div>
              <div className="formbold-input-flex">
                <div>
                  <label htmlFor="email" className="formbold-form-label">
                    {" "}
                    Email{" "}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    disabled={email!==""}
                    placeholder="example@email.com"
                    className="formbold-form-input"
                  />
                </div>
                <div>
                  <label className="formbold-form-label">Gender</label>
                  <select
                    className="formbold-form-input"
                    name="occupation"
                    id="occupation"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>
              <div className="formbold-mb-3 formbold-input-wrapp">
                <label htmlFor="phone" className="formbold-form-label">
                  {" "}
                  Phone{" "}
                </label>
                <div>
                  <input
                    type="text"
                    name="areacode"
                    id="areacode"
                    value={"+91"}
                    disabled={true}
                    placeholder="Area code"
                    className="formbold-form-input formbold-w-45"
                  />
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={phone}
                    disabled={phone!==""}
                    placeholder="Phone number"
                    className="formbold-form-input"
                  />
                </div>
              </div>
              <div className="formbold-mb-3">
                <label htmlFor="age" className="formbold-form-label">
                  {" "}
                  Applying for Position:{" "}
                </label>
                <input
                  type="text"
                  name="age"
                  id="age"
                  className="formbold-form-input"
                  value={jobTitle}
                  disabled
                />
              </div>
              <div className="formbold-mb-3">
                <label htmlFor="dob" className="formbold-form-label">
                  {" "}
                  When can you start?{" "}
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={startDate}
                  onChange={changeDate}
                  className="formbold-form-input"
                />
              </div>
             
              <div className="formbold-form-file-flex">
                <label htmlFor="message" className="formbold-form-label">
                  Cover Letter
                </label>
                <div className='upload-files'>
                <input
                  type="file"
                  name="upload"
                  id="upload"
                  // className="formbold-form-file"
                />
                </div>
              </div>
              <div className="formbold-form-file-flex">
                <label htmlFor="upload"  className="formbold-form-label">
                  Upload Resume
                </label>
                <div className='upload-files'>
                <input
                  type="file"
                  name="resume"
                  accept=".doc,.docx,.pdf"
                  id="upload"
                  onChange={handleResume}
                  // className="formbold-form-file"
                />
                </div>
              </div>
              <button className="formbold-btn" type="submit">
                {submitLoading && <Spinner animation="border" size="sm" />}
                &nbsp;&nbsp;Apply Now</button>
            </form>
          </div>
        </div> }
      </>
      

    )
}

export default ApplyForm