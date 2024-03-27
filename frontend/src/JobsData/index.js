import Cookies from 'js-cookie'
import {Component} from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loader-spinner'

import JobCard from '../EachCardJob'
import './index.css'
import SearchInput from '../SearchInput'
import AdvancedSearch from '../AdvancedSearch'
import ToggleMode from '../ToggleMode'
import { mainToken } from '../data'
import MainHeader from '../MainHeader'

import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import FilterOptions from '../FilterOptions'
// require('dotenv').config()
// require('dotenv').config()

const experienceLevels = [
    {
        label: "Entry Level",
        experienceId: "ENTRYLEVEL",
    },
    {
        label: "Intermediate",
        experienceId: "INTERMEDIATE",
    },
    {
        label: "Expert",
        experienceId: "EXPERT",
    },
]
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]


const jobModeList = [
  {
      modeId: 1,
      label: 'Office',
  },
  {
    modeId: 2,
    label: 'Work From Home',
  },
  {
    modeId: 3,
    label: 'Hybrid',
  }
]

const jobScopeList = [
  {
    scopeId: 1,
    label: 'Small',
  },
  {
    scopeId: 2,
    label: 'Medium',
  },
  {
    scopeId: 3,
    label: 'Large',
  },
]
const stagesForConditionChecking = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  load: 'LOADER',
}

class JobsDetails extends Component {


  state = {
    name: '',
    imageUser: '',
    Description: '',
    totalJobs: [],
    inputValue: '',
    listOfSaved: [],
    RadioInput: 0,
    modeInput: 0,
    EmployList: [],
    stateDeclared: 'initial',
    CheckingProfileData: 'initial',
  }

   first_name = ["Kai", "Eliana", "Jaden", "Ezra", "Luca", "Rowan", "Nova", "Amara", "Aaliyah", "Finn"];
	 last_name= ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Wilson"];
	 

  async componentDidMount() {
    // await this.showProfile()
    await this.FetchingData()
    await this.jobsData()
  }

  showProfile() {
      
  }

  getRandomDate() {
    const year = Math.floor(Math.random() * 10) + 2015; // Random year between 2015 and 2024
    const month = Math.floor(Math.random() * 12); // Random month (0-11)
    const day = Math.floor(Math.random() * 31) + 1; // Random day (1-31)
    return new Date(year, month, day);
  }
  jobsData = async () => {
    this.setState({stateDeclared: stagesForConditionChecking.load})

    const {inputValue, RadioInput, EmployList} = this.state
    const fetchingJobs = `https://apis.ccbp.in/jobs?employment_type=${EmployList}&minimum_package=${RadioInput}&search=${inputValue}`
    const optionsJobs = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mainToken}`,
      },
    }
    const FetchingJobsDetails = await fetch(fetchingJobs, optionsJobs)
    const DetailsOfJobs = await FetchingJobsDetails.json()

    const jwtToken = Cookies.get('jwt_token')
      const url = `http://localhost:8000/jobs/saved`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },

      }
      const fetchedData = await fetch(url,options)
      const storedData = await fetchedData.json()
      // console.log(storedData.prevData.likes)
      const likedList = storedData.likes && storedData.likes.map(each => each.like_id) || []
      // console.log(likedList)



    if (FetchingJobsDetails.ok) {
      const jobsDataAll = DetailsOfJobs.jobs.map(each => ({
        jobTitle: each.title,//ok
        companyName: each.company_logo_url.split("/")[6].split("-")[0], //ok
        jobSalary: each.package_per_annum, //ok
        companyLogo: each.company_logo_url, //ok
        jobType: each.employment_type, 
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        
      }))
      const newJobsData = jobsDataAll.map((each,idx) => {
        return {
          ...each,
          jobMode: jobModeList[idx%3].label,
        }
      })
      const newJobsDataOne = newJobsData.map((each,idx) => {
        let rand_first = Math.floor(Math.random()*this.first_name.length); 
	      let rand_last = Math.floor(Math.random()*this.last_name.length);       
        return {
          ...each,
          datePosted: this.getRandomDate(),
          jobExperience: (Math.floor(Math.random()*10+1)).toString(),
          postedBy: this.first_name[rand_first]+" "+this.last_name[rand_last]
        }
      })
      const {modeInput} = this.state
      let finalData = newJobsDataOne
      if(modeInput!==0){
        finalData = newJobsDataOne.filter(each => each.jobMode === jobModeList[modeInput-1]['label'])
      }
      this.setState({
        totalJobs: finalData,
        listOfSaved: likedList,
        stateDeclared: stagesForConditionChecking.success,
      })
    } else {
      this.setState({stateDeclared: stagesForConditionChecking.failure})
    }
  }

  FetchingData = async () => {
    this.setState({CheckingProfileData: stagesForConditionChecking.load})
    const jwtToken = Cookies.get('jwt_token')
    const newUrl = 'http://localhost:8000/jobs'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const DataFetching = await fetch(newUrl, options)
    const DetailsOfUser = await DataFetching.json()


    if (DataFetching.ok) {
      this.setState({
        name: DetailsOfUser.username,
        Description: DetailsOfUser.firstName !== ""?DetailsOfUser.firstName :"HELLO",
        imageUser: DetailsOfUser.profileUrl !== "" ? DetailsOfUser.profileUrl:'https://res.cloudinary.com/da7y99axc/image/upload/v1709389286/dkvz3tcsezlnevxlgmft.jpg',
        CheckingProfileData: stagesForConditionChecking.success,
      })
    } else {
      this.setState({CheckingProfileData: stagesForConditionChecking.failure})
    }
  }

  successViewProfile =  () => {
    const {imageUser, name, Description} = this.state
    return (
      <div className="CardOfUser">
        <div>
          <img className="imageOfUser" src={imageUser} alt="profile" />
        </div>
        <h1 className="UserName">{name.toUpperCase()}</h1>
        <p className="Description">{Description}</p>
      </div>
    )
  }

  loaderViewProfile = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  failureViewProfile = () => (
    <div>
      <div>
        <button type="button" onClick={this.FetchingData}>
          Retry
        </button>
      </div>
    </div>
  )

  ProfileChecking = () => {
    const {CheckingProfileData} = this.state

    switch (CheckingProfileData) {
      case 'SUCCESS':
        return this.successViewProfile()
      case 'FAILURE':
        return this.failureViewProfile()
      case 'LOADER':
        return this.loaderViewProfile()
      default:
        return null
    }
  }

  changeInput = event => {
    this.setState({inputValue: event.target.value})
  }

  searchInputDown = event => {
    if (event.key === 'Enter') {
      this.jobsData()
    }
  }

  buttonSearch = () => {
    this.jobsData()
  }

  RadioChange = event => {
    this.setState({RadioInput: event.target.id}, this.jobsData)
  }

  changeMode = event => {
    this.setState({modeInput: event.target.id},this.jobsData)
  }

  EmployLists = event => {
    const {EmployList} = this.state
    const CheckboxNotInLists = EmployList.filter(
      each => each === event.target.id,
    )
    if (CheckboxNotInLists.length === 0) {
      this.setState(
        prevState => ({EmployList: [...prevState.EmployList, event.target.id]}),
        this.jobsData,
      )
    } else {
      const filterData = EmployList.filter(each => each !== event.target.id)
      this.setState(
        {
          EmployList: filterData,
        },
        this.jobsData,
      )
    }
  }

  onHeartClick = async (id,isRed) => {
    if(isRed){
      const jwtToken = Cookies.get('jwt_token')
      const url = `http://localhost:8000/jobs/${id}`
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },

      }
      const DataFetching = await fetch(url, options)
      const DetailsOfUser = await DataFetching.json()
      // console.log(DetailsOfUser.likes)
      const likedList = DetailsOfUser.likes.map(each => each.like_id)
        this.setState({listOfSaved: likedList})
    }
    else{
      const jwtToken = Cookies.get('jwt_token')
        const url = `http://localhost:8000/jobs/${id}`
        const options = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },

        }
        const DataFetching = await fetch(url, options)
        const DetailsOfUser = await DataFetching.json()
        // console.log(DetailsOfUser.likes)
        const likedList = DetailsOfUser.likes.map(each => each.like_id)
        this.setState({listOfSaved: likedList})
    }
  }

  renderALlData = () => {
    const {totalJobs} = this.state

    return (
      <div className="AllDataOfItems">
        <h4 style={{fontWeight: "bold"}}>{`Number of Job Posts: ${totalJobs.length}`}</h4>
        {totalJobs.map(each => (
          <JobCard 
          each={each} 
          onHeartClick={this.onHeartClick} 
           isStarred={this.state.listOfSaved.includes(each.id)}
           key={each.id} />
        ))}
      </div>
    )
  }

  DataNotFound = () => (
    <div className="DataNot">
      <div>
        <img
          className="noJobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
        />
      </div>
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  handleSearchChange = (event) => {
    // Handle search input changes here
    console.log(event.target.value);
  };



  renderSuccessView = () => {
    const {totalJobs, inputValue} = this.state
    const changeByDate = (order) => {
      let jobListByOrder = totalJobs 
      if(order === 'asc'){
         jobListByOrder = totalJobs.sort((a, b) => a.datePosted - b.datePosted)
      }
      else{
        jobListByOrder = totalJobs.sort((a, b) => b.datePosted - a.datePosted)
      }
      this.setState({totalJobs: jobListByOrder})
    }
    const DataOfAllFetching =
      totalJobs.length > 0 ? this.renderALlData() : this.DataNotFound()

    return (
      <div className="jobsAllBg">
        <div className="flexingData">
          <div className="detailsOfAllJobs">
          <div className='main-search'>
            <div className="search-items">
            <button className='free-button'>
              <a href="/jobs/latest" className='free-jobs'>
              <b>Freelance Jobs</b></a>
            </button>
              <div className="searchBar">
                  
              <SearchInput value={inputValue} 
              placeholder="Type here to search" 
              onChange={this.changeInput} 
              onKeyDown={this.searchInputDown}/>
              </div>

              <AdvancedSearch/>
              
          
              <Link to="/jobs/saved">
                  <button type="button" className='saved-button'>Saved Jobs</button>
              </Link>
            </div>
           <div className='mode'>
            <FilterOptions changeByDate={changeByDate}/>
           <ToggleMode/>
           </div>
              
            
            </div>
            
            {DataOfAllFetching}
          </div>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
      </div>
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.jobsData} type="button">
        Retry
      </button>
    </div>
  )

  loaderView = () => (
    <div className="loader-container main-jobs-loading" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  coditionChecking = () => {
    const {stateDeclared} = this.state
    switch (stateDeclared) {
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.failureView()
      case 'LOADER':
        return this.loaderView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken === undefined){
      return <Redirect to='/login'/>
    }
    const {listOfSaved} = this.state 
    return (
      <div className='main-box-jobs'>
        <MainHeader/>
        <div className="flexingItemsJobs">
          <div className="ProfileSide">
            {this.ProfileChecking()}
            <div>
              <div>
                <hr />
                <h1 className="TypeOfEmploy">Type of Employment</h1>
                <ul className="Ul">
                  {employmentTypesList.map(each => (
                    <li className="each-check" key={each.employmentTypeId}>
                 <label className="checkbox-container">
                 <input type="checkbox" onChange={this.EmployLists} id={each.employmentTypeId}/>
                      <span className="checkmark"></span>
                  </label>
                  <label className="check-name-box" htmlFor={each.employmentTypeId}>{each.label}</label>

                    </li>
                  ))}
                </ul>
              </div>
              <hr />
              <div>
                <h1 className="SalaryRange">Salary Range</h1>
                <ul className="Ul">
                  {salaryRangesList.map(each => (
                    <li key={each.salaryRangeId}>
                      <input
                        id={each.salaryRangeId}
                        value={each.label}
                        type="radio"
                        name="salary"
                        className='box'
                        onChange={this.RadioChange}
                      />
                      <label htmlFor={each.salaryRangeId} className='check-name'> {each.label} </label>
                    </li>
                  ))}
                </ul>
              </div>

             <hr/>
              <div>
                <h1 className="SalaryRange">Job Mode</h1>
                <ul className="Ul">
                  {jobModeList.map(each => (
                    <li key={each.modeId}>
                      <input
                        id={each.modeId}
                        value={each.label}
                        type="radio"
                        name="mode"
                        onChange={this.changeMode}
                        className='box'
                      />
                      <label htmlFor={each.modeId} className='check-name'> {each.label} </label>
                    </li>
                  ))}
                </ul>
              </div>

              <hr/>
              <div>
                <h1 className="SalaryRange">Job Scope</h1>
                <ul className="Ul">
                  {jobScopeList.map(each => (
                    <li key={each.scopeId}>
                      <input
                        id={each.scopeId}
                        value={each.label}
                        type="radio"
                        name="scope"
                        onChange={this.changeScope}
                        className='box'
                      />
                      <label htmlFor={each.scopeId} className='check-name'> {each.label} </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="ChecksData">{this.coditionChecking()}</div>
        </div>
      </div>
     
    )
  }
}

export default JobsDetails




