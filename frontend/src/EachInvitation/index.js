import React,{useState,useEffect} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import Swal from 'sweetalert2'
import Loader from 'react-loader-spinner'
import {URL} from '../data'

const EachInvitation = (props) => {
    const [value,setValue] = useState(0)
    const [isLoading,setIsLoading] = useState(true)
    const {invite} = props 
    useEffect(() => {
        const jwtToken = Cookies.get('jwt_token')
        const newUrl = `${URL}/jobs/invitations/${invite.inviteId}`
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
        fetch(newUrl, options)
       .then(async(response) =>{
            const data = await response.json()
            setValue(data.value)
            setIsLoading(false)
       })
    },[])
    const sendResponse = (val) => {
        const jwtToken = Cookies.get('jwt_token')
            const newUrl = `${URL}/jobs/invitations/${invite.inviteId}`
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({val})
            }
            fetch(newUrl, options)
            .then(async(response) =>{
                const data = await response.json();
                if(data.update === true){
                    const msg = val===1?'You have successfully accepted the invitation':
                    'You have successfully rejected the invitation'
                    Swal.fire({
                        title: 'Success',
                        text: msg,
                        icon: "success"
                    });
                    setValue(val)
                }
            })
    }
    const acceptInvite = () => {
        sendResponse(1)
    }
    const rejectInvite = () => {
        sendResponse(-1)
    }
    if(isLoading){
        return (
            <div className="loader-container" data-testid="loader">
                <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
        )
    }
    return (
        <div className='box2'>
             <p>{invite.companyName}</p>
             <h5><strong>{invite.jobTitle}</strong></h5>
             <p style={{marginTop: "12px"}}><b>{`Invitation from ${invite.inviter}`}</b></p>
             {value===0 && <div className='d-flex invite-btns'>
                <button className='invite-button-accept' onClick={acceptInvite}>ACCEPT</button>
                <button className='invite-button-reject' onClick={rejectInvite}>REJECT</button>
             </div>}
             {value===1 && <div>
                    <p className='status-msg'><i className="fa-solid fa-circle-check icon-g"></i>You have accepted the invitation</p>
                </div>}
                {value===-1 && <div>
                    <p className='status-msg'><i className="fa-solid fa-circle-xmark icon-r"></i>You have rejected the invitation</p>
                    </div>}
        </div>
        
    )
}

export default EachInvitation