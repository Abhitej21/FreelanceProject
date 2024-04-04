import React, { useState } from 'react'
import axios from 'axios'
import './index.css'
import Swal from 'sweetalert2'

const ForgotPassword = () => {
    const [email,setEmail] = useState()

    const submitDetails = (event) => {
      event.preventDefault()
      console.log(email)
      axios.post('http://localhost:8000/forgot-password',{email})
      .then(res => {
        if(res.data.token){
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Confirmation link sent to your mail",
              showConfirmButton: false,
              timer: 3000,
            });
            setEmail('')
        }
      })
    }
    const changemail = (event) => {
      setEmail(event.target.value)
    }
    return (
      <div className='main'>
        <form onSubmit={submitDetails}>
        <div className="login-box">
          <h3 style={{color: "white",marginBottom: "15px"}}>Forgot Password</h3>
          <input
            type="email"
            className="email ele"
            value={email}
            placeholder="Your mail"
            onChange={changemail}
          />
       
          <button className="clkbtn" type="submit">
            Submit
          </button>
        </div>
      </form>
      </div>
    )
}

export default ForgotPassword;