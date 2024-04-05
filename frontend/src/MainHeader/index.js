import React,{useState,useEffect} from 'react'
import ImageLogo from "../ImageLogo";
import io from 'socket.io-client'
import './index.css'
import Cookies from 'js-cookie'
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import NotificationBadge from 'react-notification-badge';
import {URL} from '../data'

const prevNotifications = [
  {
  imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBLMTW6BPeFzoj-FUEgQWetJ-kg-vZdBIb_O7FQ3GLUg&s',
  name: 'Rohit Chennamaneni',
  text: 'Rohit sent you an invite',
},
{
  imgUrl: 'https://assets.bizclikmedia.net/576/15854893995819287b3a084bd73a4b20:0d64277fe26583ad50056b3cac55bf79/download-20-2-2.png',
  name: 'George Hembulton<',
  text: 'George posted a new Job',
},
{
  imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBLMTW6BPeFzoj-FUEgQWetJ-kg-vZdBIb_O7FQ3GLUg&s',
  name: 'Chaitanya Peddi',
  text: 'Chaitanya posted a new Job Post',
},

]
const socket = io.connect(`${URL}`)
const MainHeader = () => {
  const [bellOpen,setBellOpen] = useState(false)
  const [count,setCount] = useState(0)
 const [notifications,setNotifications] = useState([])
//  useEffect(() => {
//   async function fetchNotifications(){
//       const jwtToken = Cookies.get('jwt_token')
//       const newUrl = `http://localhost:8000/notifications`
//       const options = {
//           method: 'GET',
//           headers: {
//               'Authorization': `Bearer ${jwtToken}`,
//           },
//       }
//       fetch(newUrl, options)
//       .then(async(response) =>{
//           const data = await response.json();
//           setNotifications(data);
//       })
      
//   }
//   fetchNotifications()
// },[])
   useEffect(() => {
    socket.on('message',(msg) => {
      const {wallTime,fullDocument} = msg
      console.log(fullDocument.companyLogo)
      const filteredNotify = notifications.filter(notification => notification.wallTime === wallTime)
      if(filteredNotify.length===0){
        setNotifications((prev) => [{
          wallTime: wallTime,
          imgUrl: fullDocument.companyLogo,
          name: fullDocument.companyName,
          text: `New Job Post from ${fullDocument.companyName}`,
        },...prev])
      }
      setCount((count) => count+1)
     })
    return () => {
      socket.off('message');
    };
   },[notifications])
  const [condition,setCondition] = useState({bellOpen: false,height: '0px',opacity: 0})
  const bellClicked = () => {
      if(bellOpen===false){
        setCondition((condition) => {
          return {...condition,
          bellOpen: true,
          height: 'auto',
          opacity: 1,
          }
        })
      }
      else{
        setCondition((condition) => {
          return {
            ...condition,
            bellOpen: false,
            height: '0px',
            opacity: 0,
          }
        })
      }

     
  }

  const errorImage = (error) => {
    console.log("Error in loading the image")
  }
  const onBellClick = () => {
    setCount(0)
  }

    return <>
  {/* Navbar */}
  <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary nav">
    {/* Container wrapper */}
    <div className="container-fluid head">
      {/* Toggle button */}
      <button
        data-mdb-collapse-init=""
        className="navbar-toggler"
        type="button"
        data-mdb-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="fas fa-bars" />
      </button>
      {/* Collapsible wrapper */}
      <div className="collapse navbar-collapse pages" id="navbarSupportedContent">
        {/* Navbar brand */}
        <div className='logo-name'>
                    <Link to="/" className="link">
                      <span>Job<span className='ex'>Street </span></span>
                    </Link>
        </div>
        {/* Left links */}
       
        {/* Left links */}
      </div>
      {/* Collapsible wrapper */}
      {/* Right elements */}
      <div className="d-flex justify-content-space-around align-items-center">
        <div className="pages">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link link-name" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link link-name" href="/jobs">
              Jobs
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link link-name" href="/jobs/applied">
              My Applications
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link link-name" href="/jobs/invitations">
              Invitations
            </a>
          </li>
        </ul>
        </div>
        {/* Notifications */}

         <div className="dropdown">
          <div onMouseEnter={() => onBellClick()}>
          {/* <div className='badge'><NotificationBadge count={count} effect={Effect.SCALE}/></div> */}
      <div>  <i className="fa-regular fa-bell bell"></i></div></div>
         
         
                <div className="dropdown-content">
                  {notifications.length===0 && <p style={{color: "black",marginLeft: "40px"}}>No Notifications found</p>}
                {notifications.length>0 && <ul>
                  {notifications.map((each) => {
                    const text = `New Job Post from ${each.name}`
                     return <li>
                       <div className="notifications-item">
                       <img src={each.imgUrl} alt="img"
                       onError={errorImage}/>
                          <div className="text">
                              <h4>{each.name}</h4>
                              <p>{text}</p>
                          </div>
                      </div>
                     </li>
                  })}
                   
                </ul>}
            
                </div>
        </div>
        {/* Avatar */}
       <ImageLogo/>
      </div>
      {/* Right elements */}
    </div>
    {/* Container wrapper */}
  </nav>
  {/* Navbar */}
</>

}

export default MainHeader;