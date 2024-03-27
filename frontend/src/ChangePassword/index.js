import React,{useState} from 'react'
import './index.css'

const ChangePassword = () => {
    const [username,setUsername] = useState()
    const [oldPassword,setOldPassword] = useState()
    const [password,setPassword] = useState()

    const changeUserName = (event) => {
        setUsername(event.target.value)
    }
    const changeOldPassword = (event) => {
        setOldPassword(event.target.value)
    }
    const changePassword = (event) => {
        setPassword(event.target.value)
    }
    const submitDetails = () => {
        
    }
    return <div className={`form-section`}>
    {/* login form */}
    <form onSubmit={submitDetails}>
      <div className="login-box">
        <input
          type="text"
          className="email ele"
          placeholder="Your UserName"
          onChange={changeUserName}
        />
        <input
          type="password"
          className="password ele"
          placeholder="Your old Password"
          onChange={changeOldPassword}
        />
        <input
          type="password"
          className="password ele"
          placeholder="Your Password"
          onChange={changePassword}
        />
        <button className="clkbtn" type="submit">
            Sumbit
        </button>
      </div>
    </form>
  </div>
}

export default ChangePassword;