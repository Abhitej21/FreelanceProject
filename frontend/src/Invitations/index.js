import React,{useEffect,useState} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import EachInvitation from '../EachInvitation'
import Loader from 'react-loader-spinner'
import MainHeader from '../MainHeader'
import BackBtn from '../BackBtn'

const Invitations = () => {
    const [invites,setInvites] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    useEffect(() => {
        async function fetchUsername(){
            const jwtToken = Cookies.get('jwt_token')
            const newUrl = `http://localhost:8000/jobs/invitations`
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            }
            fetch(newUrl, options)
            .then(async(response) =>{
                const data = await response.json();
                setIsLoading(false)
                console.log(data)
                setInvites(data)
            })
            
        }
        fetchUsername()
    },[])
    if(isLoading){
        return (
            <div className="loader-container" data-testid="loader">
                <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
        )
    }
    
    return (
        <div className='invitaions-back'>  
            <MainHeader/>
            <div className='align-back'>
                <BackBtn/>
            </div>
            {invites.length === 0 && <div className='no-invites'>
                <h3>No Invitations Received</h3>
                <img src='https://res.cloudinary.com/da7y99axc/image/upload/v1711867576/noinvites-removebg-preview_k9pebp.png'
                alt="No Invitations" className='no-invites-img'/>
                </div>}
            {invites.length !== 0 && 
              <div className='invites'>
                <h2 className='invitation-header'>Invites from Recruiters</h2>
                <div className='list-of-invites'>{invites.map(invite => {
                    return <EachInvitation invite={invite}/>
                })}</div>
            </div>
            }
        </div>
    )
}

export default Invitations 