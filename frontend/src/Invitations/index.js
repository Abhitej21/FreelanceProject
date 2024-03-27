import React,{useEffect,useState} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import EachInvitation from '../EachInvitation'
import Loader from 'react-loader-spinner'
import MainHeader from '../MainHeader'

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
        <>  
            <MainHeader/>
            {invites.length === 0 && <h3>No Invitations Received</h3>}
            {invites.length !== 0 && 
              <div className='invites'>
                <h2 className='invitation-header'>Invites from Recruiters</h2>
                <div className='list-of-invites'>{invites.map(invite => {
                    return <EachInvitation invite={invite}/>
                })}</div>
            </div>
            }
        </>
    )
}

export default Invitations 