import React,{useState,useEffect} from 'react'
import MainHeader from '../MainHeader'
import Cookies from 'js-cookie'
import './index.css'
import EachApplied from '../EachApplied'
import Loader from 'react-loader-spinner'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const AppliedJobs = () => {
    const [jobs,setJobs] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    useEffect(() => {
        async function fetchUsername(){
            const jwtToken = Cookies.get('jwt_token')
            const newUrl = `http://localhost:8000/appliedjobs`
            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
            fetch(newUrl, options)
            .then( async(response) =>{
                const data = await response.json();
                console.log(data.data)
                setIsLoading(false)
                setJobs(data.data)
            })
            
        }
        fetchUsername()
    },[jobs])

    if(isLoading){
        return <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
    }

    return (
        <>
        <MainHeader/>
        <div className="list-back">
          <h1 className='latest'>Jobs Applied By You</h1>
          <div className='top-btns-one'>
          <button type="button" className='back-button'>
            <a href="/jobs" style={{textDecoration: "none",color: "white"}}>
              <i class="fa-solid fa-arrow-left" style={{marginRight: "5px"}}></i>
                  Go Back</a>
              </button>
          </div>
              <div className='home-page-content'>
               {jobs.length === 0 && <div className='no-img-div'>
                <img 
               className='no-applications'
               src="https://freepngimg.com/thumb/facebook/72547-thinking-photography-question-mark-man-stock.png"
                alt="No applications"/>
                <h1 style={{color: "white"}}>No Applications till now</h1></div>}
                  {jobs && jobs.map((details,index) =>  
                      <EachApplied key={index} details={details}/>
                  )}
              </div>
          </div>
          </>
      )
}


export default AppliedJobs 