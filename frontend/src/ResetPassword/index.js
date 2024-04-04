import React, { useState } from 'react'
import './index.css'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import Swal from 'sweetalert2'

const ResetPassword = () => {
    const [password,setPassword] = useState()
    const history = useHistory()
    const {id,token} = useParams()
    const submitDetails = (event) => {
      event.preventDefault()
      console.log(password)
      axios.post(`http://localhost:8000/reset-password/${id}/${token}`,{password})
      .then(res => {
        if(res.data.message === 'Success'){
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Password Updated Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          setPassword('')
          setTimeout(() => {
            history.push('/login')
          },2000)
        }
        else{
            console.log(res)
        }
      })
    }
    const changePassword = (event) => {
      setPassword(event.target.value)
    }
    return (
      <div className='main'>
        <form onSubmit={submitDetails}>
        <div className="login-box">
          <h3 style={{color: "white",marginBottom: "15px"}}>Reset Password</h3>
          <input
            type="password"
            className="email ele"
            value={password}
            placeholder="Enter password"
            onChange={changePassword}
          />
       
          <button className="clkbtn" type="submit">
            Update
          </button>
        </div>
      </form>
      </div>
    )
}

export default ResetPassword;