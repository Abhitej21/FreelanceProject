import React,{useEffect,useState} from 'react'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import ExitIcon from '@rsuite/icons/Exit';
import './index.css'
import { Link, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from 'react-loader-spinner';
import {URL} from '../data'

const ImageLogo = () => {
 const [userDetails,setUserDetails] = useState({})
 const [redirect,setRedirect] = useState(false)
 const [isLoading,setIsLoading] = useState(true)
  useEffect(() => {
    async function fetchUsername(){
        const jwtToken = Cookies.get('jwt_token')
        const newUrl = `${URL}/image`
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
          bio,
          profileUrl,
          firstName,
          lastName,
        })
        
    }
    fetchUsername()
},[]);
  

  const logOut = (event) => {
    event.preventDefault()
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout the application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout"
    }).then(async (result) => {
      if(result.isConfirmed){
        Cookies.remove('jwt_token')
        setRedirect(true)
        setIsLoading(false)
      }
    });
    
  }
  if(isLoading){
    <div className="loader-container main-jobs-loading" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  }
  if(redirect){
    return <Redirect to="/"/>
  }

  const errorImage = (event) => {
    event.target.src = 'https://res.cloudinary.com/da7y99axc/image/upload/v1711741848/profile-icon-png-898_bezbbd.png'
  }
  const {profileUrl,username,bio,firstName,lastName} = userDetails 
  const first = firstName!==undefined ? (firstName.charAt(0).toUpperCase()+firstName.slice(1)): ""
  const last = lastName!== undefined ? (lastName.charAt(0).toUpperCase()+lastName.slice(1)): ""
  return (
      <div className="dropdown">
    <img className="logo-sm" src={profileUrl} onError={errorImage}/>
    <div className="drop-content">
      <div className='info'>
        <img className="pic" src={profileUrl} onError={errorImage}/>
        <p className='name'>{first+" "+last}</p>
        <p className='role'>{bio}</p>
      </div>
      <Link to={`/profile/${username}`}>
        <div className='flex'>
        <i className="fa-solid fa-user"></i>
        <p className='option'>Profile</p>
        </div>
      </Link>
      <Link to="" onClick={logOut}>
      <div className='flex'>
        <ExitIcon/>
        <p className='option'>Log out</p>
        </div>
      </Link>
  </div>
</div>
  )
}

export default ImageLogo;