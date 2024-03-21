import React,{useEffect,useState} from 'react'
import Cookies from 'js-cookie'
import $ from 'jquery'
import './index.css'
import JobElement from '../JobElement'
import MainHeader from '../MainHeader'

const LatestJobs = () => {
    const [jobs,setJobs] = useState([])
    const [originalJobs,setOriginalJobs] = useState([]) 
    const [index,setIndex] = useState('1')
    const changeByDate = (order) => {
        let jobListByOrder = jobs 
        console.log(order) 
        if(order === "1"){
            console.log("hi")
           jobListByOrder = jobs.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted))
        }
        else{
          jobListByOrder = jobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
        }
        console.log(jobListByOrder)
        setJobs(jobListByOrder)
      }
    useEffect(() => {
        async function fetchUsername(){
            const jwtToken = Cookies.get('jwt_token')
            const newUrl = `http://localhost:8000/latestjobs`
            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
            const DataFetching = await fetch(newUrl, options)
            const DetailsOfUser = await DataFetching.json()
            console.log(DetailsOfUser)
            const data = DetailsOfUser
            setOriginalJobs(data)
            setJobs(data)
        }
        fetchUsername()
    },[])
    useEffect(() => {
        changeByDate(index);
        // searchJob();
      },[originalJobs]);
    
      const changeOrder = (event) => {
        changeByDate(event.target.value)
        setIndex(event.target.value)
      }
    return (
      <>
      <MainHeader/>
      <div className="list-back">
        <h1 className='latest'>Latest Freelancing Jobs Posted By Recruiters</h1>
        <div className='top-btns'>
        <button type="button" className='back-button'>
          <a href="/jobs" style={{textDecoration: "none",color: "white"}}>
            <i class="fa-solid fa-arrow-left" style={{marginRight: "5px"}}></i>
                Go Back</a>
            </button>
       
        <div className ="dropdown-latest">
        
                <select className="custom-select" id="sort" onChange={changeOrder}>
                    <option>Sort By Date <i className="fa-regular fa-filter filter"></i></option>
                    <option value="2">Show Latest</option>
                    <option value="1">Show Oldest</option>
                </select>
        </div>
        </div>
            <div className='home-page-content'>
                {jobs && jobs.map((job, index) =>  <JobElement key={index} index={index} job={job}/>
                )}
            </div>
        </div>
        </>
    )
}

export default LatestJobs