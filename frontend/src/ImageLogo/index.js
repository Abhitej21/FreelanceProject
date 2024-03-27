import React,{useEffect,useState} from 'react'
import Cookies from 'js-cookie'
import ExitIcon from '@rsuite/icons/Exit';
import './index.css'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const ImageLogo = () => {
 const [userDetails,setUserDetails] = useState({})
  useEffect(() => {
    async function fetchUsername(){
        const jwtToken = Cookies.get('jwt_token')
        const newUrl = 'http://localhost:8000/image'
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        }
        const DataFetching = await fetch(newUrl, options)
        const DetailsOfUser = await DataFetching.json()
        const {username,profileUrl,bio,firstName,lastName} = DetailsOfUser 

        setUserDetails({
          ...userDetails,
          username,
          profileUrl,
          bio,
          firstName,
          lastName,
        })
    }
    fetchUsername()
},[])
  

  const logOut = () => {
    Cookies.remove('jwt_token')
    return <Redirect to='/'/>
  }
  const {profileUrl,username,bio,firstName,lastName} = userDetails 
  const first = firstName!==undefined ? (firstName.charAt(0).toUpperCase()+firstName.slice(1)): ""
  const last = lastName!== undefined ? (lastName.charAt(0).toUpperCase()+lastName.slice(1)): ""
  return (
      <div className="dropdown">
    <img className="logo-sm" src={profileUrl}/>
    <div className="drop-content">
      <div className='info'>
        <img className="pic" src={profileUrl}/>
        <p className='name'>{first+" "+last}</p>
        <p className='role'>{bio}</p>
      </div>
      <a href={`/profile/${username}`}>
        <div className='flex'>
        <i className="fa-solid fa-user"></i>
        <p className='option'>Profile</p>
        </div>
      </a>
      <a href="" onClick={logOut}>
      <div className='flex'>
        <ExitIcon/>
        <p className='option'>Log out</p>
        </div>
      </a>
  </div>
</div>
  )
}

export default ImageLogo;