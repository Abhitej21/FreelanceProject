import React,{useEffect,useState} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import JobElement from '../JobElement'
import MainHeader from '../MainHeader'
import Loader from 'react-loader-spinner'

const LatestJobs = () => {
    const [jobs,setJobs] = useState([])
    const [originalJobs,setOriginalJobs] = useState([]) 
    const [isLoading,setIsLoading] = useState(true)
    const [index,setIndex] = useState('1')
    const changeByDate = (order) => {
        let jobListByOrder = jobs 
        if(order === "1"){
           jobListByOrder = jobs.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted))
        }
        else{
          jobListByOrder = jobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
        }
        setJobs(jobListByOrder)
      }
    useEffect(() => {
        async function fetchUsername(){
            const jwtToken = Cookies.get('jwt_token')
            const newUrl = `http://localhost:8000/jobs/latest`
            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
            const DataFetching = await fetch(newUrl, options)
            const DetailsOfUser = await DataFetching.json()
            const data = DetailsOfUser
           
            setOriginalJobs(data)
            setJobs(data)
            setIsLoading(false)
        }
        fetchUsername()
    },[])
    // useEffect(() => {
    //     changeByDate(index);
    //   },[originalJobs]);
    
      const changeOrder = (event) => {
        changeByDate(event.target.value)
        setIndex(event.target.value)
      }
    return (
      <>
      <MainHeader/>
      <div className="list-back">
        <h1 className='latest'>Latest Freelancing Jobs Posted By Recruiters</h1>
        {isLoading &&  <div className="loader-container-latest" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>}
    {!isLoading && 
      <div>
        <div className='top-btns'>
        <button type="button" className='back-button'>
          <a href="/jobs" style={{textDecoration: "none",color: "white"}}>
            <i className="fa-solid fa-arrow-left" style={{marginRight: "5px"}}></i>
                Go Back</a>
            </button>
       
        <div className ="dropdown-latest">
        
                <select className="custom-select" id="sort" onChange={changeOrder}>
                    <option>Sort By Date</option>
                    <option value="2">Show Latest</option>
                    <option value="1">Show Oldest</option>
                </select>
        </div>
        </div>
            <div className='home-page-content'>
                {jobs && jobs.map((job,index)  => {
                  return <JobElement job={job.job} recruiter={job.recruiter} key={index}/>
                }
                 
                )}
            </div>
        </div>}
        </div>
        </>
    )
}

export default LatestJobs