import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import * as React from 'react'
import { Link, withRouter } from 'react-router-dom/cjs/react-router-dom.min.js'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
// import {FaRegStar} from 'react-icons/fa'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {FaStar, FaShareSquare} from 'react-icons/fa'

import './index.css'
import SimilarJobDetails from '../SimilarJobs'
import { mainToken } from '../data.js'


const statusForJobs = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADER',
}

class JobItemDetails extends Component {
  state = {
    statusForJobsSession: 'initial',
    jobCard: [],
    skill: [],
    similarJobs: [],
     right: true,
  }

  componentDidMount() {
    this.dataForEachJobFinding()
  }

  dataForEachJobFinding = async () => {
    this.setState({statusForJobsSession: statusForJobs.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const urlData = `https://apis.ccbp.in/jobs/${id}`
    
    console.log(urlData)
    const optionsJobs = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mainToken}`,
      },
    }
    const fetchingJobs = await fetch(urlData, optionsJobs)
    // console.log(fetchingJobs)
    const fetchingInJson = await fetchingJobs.json()
    // console.log(fetchingInJson)

    if (fetchingJobs.ok) {
      this.setState({
        statusForJobsSession: statusForJobs.success,
      })
      const dataCollecting = {
        description: fetchingInJson.job_details.job_description,
        companyLogo: fetchingInJson.job_details.company_logo_url,
        title: fetchingInJson.job_details.title,
        rating: fetchingInJson.job_details.rating,
        location: fetchingInJson.job_details.location,
        employType: fetchingInJson.job_details.employment_type,
        package: fetchingInJson.job_details.package_per_annum,
        lifeAt: fetchingInJson.job_details.life_at_company.description,
        imageLifeAt: fetchingInJson.job_details.life_at_company.image_url,
        companyWebSite: fetchingInJson.job_details.company_website_url,
      }

      const skillForJob = fetchingInJson.job_details.skills.map(each => ({
        name: each.name,
        imageSkill: each.image_url,
        id: each.name,
      }))

      this.setState({
        jobCard: dataCollecting,
        skill: skillForJob,
        similarJobs: fetchingInJson.similar_jobs,
      })
    } else {
      this.setState({statusForJobsSession: statusForJobs.failure})
    }
  }

  loaderViewJobs = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

   list = (anchor) => {
    const {jobCard,skill,similarJobs} = this.state
    return (
    <Box
      sx={{ width: 1200 }}
      role="presentation"
      className="main-box"
      onClick={this.toggleDrawer(anchor, false)}
      onKeyDown={this.toggleDrawer(anchor, false)}
    >
      <div className="DetailsOfSingleJob">
        <div className="detailsOfSmallScreens">
          <div className="SingleJobImageFlex">
          <div className='top-details'>
            <div>
              <img
                className="ImageOfSingleJob"
                src={jobCard.companyLogo}
                alt="job details company logo"
              />
            </div>
            <div className="StarFlexSingle">
              <h1>{jobCard.title}</h1>
              <p>
                <FaStar className="Stars" />
                &nbsp;&nbsp;
                {jobCard.rating}
              </p>
            </div>
            </div>
            <div>
              <Link to="/jobs">
            <button className='close-button'>CLOSE</button>
            </Link>
            </div>
          </div>
          <div className="LocationSingleJob">
            <div className="employeSingle">
              <p>
                <IoLocationOutline />
                &nbsp; &nbsp;
                {jobCard.location}
              </p>
              <p>
                <BsBriefcaseFill />
                &nbsp; &nbsp;
                {jobCard.employType}
              </p>
            </div>
            <div>
              <p>{jobCard.package}</p>
            </div>
          </div>
          <hr />
          <div className="DiscriptionFlex">
            <h1>Description</h1>
            <div className="Visit">
              <Link className="anchor" to={jobCard.companyWebSite}>
                Visit
              </Link>
              &nbsp;
              <FaShareSquare className="Share" />
              &nbsp;
            </div>
          </div>
          <p>{jobCard.description}</p>

          <h1>Skills</h1>
          <div className="flexingJobsSkills">
            {skill.map(each => (
              <div className="eachSkill" key={each.id}>
                <img src={each.imageSkill} alt={each.name} />
                <p className="eachSkillPara">{each.name}</p>
              </div>
            ))}
          </div>
          <div className="LifeAtFlex">
            <div className="LifeAtCompany">
              <h1>Life at Company</h1>
              <p>{jobCard.lifeAt}</p>
            </div>
            <div>
              <img
                className="lifeAtCompanySmallScreens"
                src={jobCard.imageLifeAt}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="SimilarJobsHeadingSmallScreens">Similar Jobs</h1>
          <ul className="ul">
            {similarJobs.map(each => (
              <SimilarJobDetails eachElement={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    </Box>
  )};

   toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    
    this.setState({ ...this.state, [anchor]: open });
  };

  closeDrawer = () => {
    const {history} = this.props 
    this.toggleDrawer('right', false)
    history.push('/jobs')
    
  }

  successViewJobs = () => {
    const {jobCard, skill, similarJobs} = this.state

    return (
        <SwipeableDrawer
          anchor={'right'}
          open={this.state['right']}
          onClose={this.closeDrawer}
          onOpen={this.toggleDrawer('right', true)}
        >
          {this.list('right')}
        </SwipeableDrawer>
    )
  }

  failureViewJobs = () => (
    <div>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
      </div>
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.dataForEachJobFinding} type="button">
        Retry
      </button>
    </div>
  )

  conditionCheckingForJobs = () => {
    const {statusForJobsSession} = this.state

    switch (statusForJobsSession) {
      case 'SUCCESS':
        return this.successViewJobs()
      case 'FAILURE':
        return this.failureViewJobs()
      case 'LOADER':
        return this.loaderViewJobs()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bgJobItemDetail">
        {/* <Header /> */}

        {this.conditionCheckingForJobs()}
      </div>
    )
    
  }
}
export default withRouter(JobItemDetails)
