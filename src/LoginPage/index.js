import {Component} from 'react'

import axios from 'axios'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'
import Cookies from 'js-cookie'


class LoginPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            message: "",
            slider: "",
            formSection: "",
            signupusername:"",
            signuppassword: "",
            signupconfirm: "",
            signupname: "",
        }
    }
    
    componentDidMount(){
        this.props.history.push('/login')
    }
    // history = useHistory()
    // goToHome = token => {
    //     const {history} = this.props 
    //     Cookies.set('jwt_token',token,{expires: 30})
    //     history.replace('/')
    // }
    onSignUp = () => {
        this.setState({slider: "moveslider",formSection: "form-section-move"})
        // slider.classList.add("moveslider");
        // formSection.classList.add("form-section-move");
        
        this.props.history.push('/signup')
    }
    onLogin = () => {
        this.setState({slider: "",formSection:""})
        
        this.props.history.push('/login')
    }

    onSubmitSignUp = async event => {
        event.preventDefault()
        const {signupconfirm,signupname,signuppassword,signupusername} = this.state
        const newUser = {
            name: signupname,username: signupusername,
            password: signuppassword,confirm: signupconfirm
        }
        const url = 'http://localhost:8000/signup'
        // console.log(newUser)

        axios.post(url,newUser)
        .then((res) => console.log(res))
        .catch(err => console.log(err))
    }
    submitDetails = async event => {
        event.preventDefault();
        const {username,password} = this.state 
        // console.log(username,password)
        const url = 'http://localhost:8000/login'
        axios.post(url,{username,password})
        .then((res) => {
            console.log(typeof res.data.token)
            console.log(res.data.userExists,typeof res.data.userExists)
            Cookies.set('jwt_token',res.data.token)
            if(res.data.userExists === false){
                console.log("User not found")
                this.props.history.push('/login')
            }
            else if(res.data.token === undefined){
                console.log("Im here")
                this.props.history.push('/login')
            }
            else if(res.status === 200){
                console.log("Hello jobs")
                this.props.history.push('/jobs')
            }
        })
        .catch((err) => console.log(err))

    }

    changeName = event => {
        this.setState({signupname: event.target.value})
    }
    changeSignUpUser = event => {
        this.setState({signupusername: event.target.value})
    }
    changeSignUpPassword = event => {
        this.setState({signuppassword: event.target.value})
    }
    changeConfirm = event => {
        this.setState({signupconfirm: event.target.value})
    }


    changeUserName = event => {
        this.setState({username: event.target.value})
    }

    changePassword = event => {
        this.setState({password: event.target.value})
    }

    render(){
        const {slider,formSection} = this.state
        // const jwtTokenUser = Cookies.get('jwt_token')
        // if(jwtTokenUser !== undefined){
        //     return <Redirect to="/"/>
        // }

        // console.log("HIII I'm here")

        return (
            <div className="image-background">
            <div className='main'>
            <img className='login-image' src="https://res.cloudinary.com/da7y99axc/image/upload/v1710592196/Tablet_login-cuate_vrh8aa.png" alt="Image"/> 
            <div className="container">
                <div className={`slider ${slider}`}/>
                <div className="btn">
                <button className="login" onClick={this.onLogin}>
                    Login
                </button>
                <button className="signup" onClick={this.onSignUp}>
                    Sign Up
                </button>
                </div>
                {/* Form section that contains the
                        login and the signup form */}
                <div className={`form-section ${formSection}`}>
                {/* login form */}
                <form onSubmit={this.submitDetails}>
                    <div className="login-box">
                        <input
                        type="text"
                        className="email ele"
                        placeholder="Your UserName"
                        onChange={this.changeUserName}
                        />
                        <input
                        type="password"
                        className="password ele"
                        placeholder="Your Password"
                        onChange={this.changePassword}
                        />
                        <button className="clkbtn" type="submit">
                           Login
                        </button>
                    </div>
                </form>
                {/* signup form */}
                <div className="signup-box">
                    <input type="text"
                    className="name ele" 
                    placeholder="Enter your name" 
                    onChange={this.changeName}/>
                    <input
                    type="text"
                    className="email ele"
                    placeholder="Your Username"
                    onChange={this.changeSignUpUser}
                    />
                    <input
                    type="password"
                    className="password ele"
                    placeholder="Your Password"
                    onChange={this.changeSignUpPassword}
                    />
                    <input
                    type="password"
                    className="password ele"
                    placeholder="Confirm password"
                    onChange={this.changeConfirm}
                    />
                    <button className="clkbtn" onClick={this.onSubmitSignUp}>Signup</button>
                </div>
                </div>
            </div>   
            </div>   
            </div>
        )
    }
}


export default withRouter(LoginPage)
