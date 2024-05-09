import { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { withRouter } from "react-router-dom";
import "./index.css";
import Cookies from "js-cookie";
import { Link, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import {URL} from '../data'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",
      slider: "",
      isView: false,
      isSignView: false,
      formSection: "",
      signupusername: "",
      signuppassword: "",
      signupconfirm: "",
      signupmail: "",
      errorMsg: null,
      signErrMsg: null,
      isValid: null,
    };
  }

  componentDidMount() {
    this.props.history.push("/login");
  }

  onSignUp = () => {
    this.setState({ ...this.state,slider: "moveslider", formSection: "form-section-move" });
    // slider.classList.add("moveslider");
    // formSection.classList.add("form-section-move");
     
    // this.props.history.push("/signup");
  };
  onLogin = () => {
    this.setState({...this.state, slider: "", formSection: "" });

    this.props.history.push("/login");
  };

  setErrorMsg = (msg) => {
    this.setState({errorMsg: msg})
  }
  onSubmitSignUp = async (event) => {
    event.preventDefault();
    const { signupconfirm, signupmail, signuppassword, signupusername } = this.state;
    const newUser = {
      email: signupmail,
      username: signupusername,
      password: signuppassword,
      confirm: signupconfirm,
    };
    if(signupusername.length === 0){
      this.setState({signErrMsg: 'Username is required'})
    }
    if(signupconfirm.length < 5){
      this.setState({signErrMsg: 'Username must be at least 5 characters'})
      return;
    }
    if(signuppassword.length === 0){
      this.setState({signErrMsg: 'Password is required'})
      return;
    }
    if(signuppassword.length<6){
      this.setState({signErrMsg: 'Password must be at least 6 characters'})
      return;
    }
    if(this.validatePass(signuppassword)===false){
      this.setState({signErrMsg: 'Password must contain one Uppercase, one Lowercase,one digit and one special character'})
      return;
    }
    if(signuppassword!==signupconfirm){
      this.setState({signErrMsg: 'Passwords do not match'})
      return;
    }
    const url = `${URL}/signup`;
    // console.log(newUser)
    axios
      .post(url, newUser)
      .then((res) => {
        if(res.data.alreadyExists === true){
          this.setState({signErrMsg: 'Username already exists'})
          return;
        }
        else if(res.data.mailExists === true){
          this.setState({signErrMsg: 'Email already exists'})
          return;
        }
        else if(res.data.passwordMatch === false){
          this.setState({signErrMsg: 'Passwords do not match'})
          return;
        }
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registration Successful",
          showConfirmButton: false,
          timer: 2000,
        });
        this.setState({signupmail: '',signupusername: '',signuppassword: '',
      signupconfirm: ''})
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  submitDetails = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.setState({isValid: null})
    if(username.length===0){
      this.setState({errorMsg: 'Username is required'})
      return;
    }
    else if(username.length<5){
      this.setState({errorMsg: 'Username must be atleast 5 character'})
      return;
    }
    else if(password.length===0){
      this.setState({errorMsg: 'Password is required'})
      return;
    }
    else if(password.length<6){
      this.setState({errorMsg: 'Password must be at least 6 characters'})
      return;
    }
    const url = `${URL}/login`;
    axios
      .post(url, { username, password })
      .then((res) => {
        console.log(res)
        
        if (res.data.userExists === false) {
          console.log("User not found");
          this.setState({errorMsg:'User not found'})
          return <Redirect to="/login"/>
        } 
        else if(res.data.password === false){
          console.log("Password not matched")
          this.setState({errorMsg: 'Incorrect password'})
          return <Redirect to="/login"/>
        }
        else if (res.data.token !== undefined) {
          this.setState({
            username: "",
            password: "",
            message: "",
            slider: "",
            isView: false,
            isSignView: false,
            formSection: "",
            signupusername: "",
            signuppassword: "",
            signupconfirm: "",
            signupmail: "",
            errorMsg: null,
            signErrMsg: null,
            isValid: null,
          })
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Successful",
            showConfirmButton: false,
            timer: 2000,
          });
          Cookies.set("jwt_token", res.data.token);
          setTimeout(() => {
            this.props.history.push("/jobs");
          },2000)
          
        }
      })
      .catch((err) => console.log(err));
  };

  changeMail = (event) => {
    this.setState({ signupmail: event.target.value });
  };
  changeSignUpUser = (event) => {
    if(this.state.signupusername.length<6){
      this.setState({signupusername: event.target.value,signErrMsg: "Username must be at least 6 characters"})
    }
    else
    this.setState({ signupusername: event.target.value,signErrMsg: null});
  };
  changeSignUpPassword = (event) => {
    if(event.target.value.length<6)
    this.setState({ signuppassword: event.target.value,signErrMsg: 'Password must be atleast 6 characters' });
    else{
      this.setState({ signuppassword: event.target.value,signErrMsg: null });
    }
  };
  changeConfirm = (event) => {
    if(event.target.value!==this.state.signuppassword){
      this.setState({signupconfirm: event.target.value,signErrMsg: 'Passwords do not match'})
    }
    else{
      this.setState({ signupconfirm: event.target.value,signErrMsg: null });
    }
  };


  // LOGIN DETAILS 
  changeUserName = (event) => {
    this.setState({ username: event.target.value });
  };

  changePassword = (event) => {
    const isOk = this.validatePass(event.target.value);
    this.setState({ password: event.target.value ,errorMsg:null,isValid: isOk});
  };

  validatePass = (password) => {
    // return true
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/
    return regex.test(password)
  }

  toggleView = () => {
    this.setState((prevState) => ({
      isView:!prevState.isView,
    }));
  };

  toggleSignView = () => {
    this.setState((prevState) => ({
      isSignView:!prevState.isSignView,
    }));
  };
  render() {
    const { slider, formSection,isView,isSignView,errorMsg,signErrMsg,isValid,
      username,password
    ,signupmail,signupusername,signuppassword,signupconfirm} = this.state;
    const jwtTokenUser = Cookies.get('jwt_token')
    if(jwtTokenUser !== undefined){
        this.props.history.push("/jobs")
    }
    return (
      <div className="image-background">
        <div className='logo-name-home'>
            <span>Job<span className='ex'>Street </span></span>
            <p>Where Talent Meets Opportunity</p>
        </div>
        <div className="main">
          <img
            className="login-image"
            src="https://res.cloudinary.com/da7y99axc/image/upload/v1710592196/Tablet_login-cuate_vrh8aa.png"
            alt="Image"
          />
          <div className="login-container">
            <div className={`slider ${slider}`} />
            <div className="btn">
              <button className="login" onClick={this.onLogin}>
                Login
              </button>
              <button className="signup" onClick={() => this.onSignUp()}>
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
                    value={username}
                    placeholder="Your username"
                    onChange={this.changeUserName}
                  />
               
                  <div className="password-eye">
                  <input
                    type={isView?'text':'password'}
                    className="password ele"
                    value={password}
                    placeholder="Your Password"
                    onChange={this.changePassword}
                  />
                  
                  {!isView && <div onClick={this.toggleView} className="eye-icon"><i class="fa-regular fa-eye-slash"></i></div>}
                  {isView && <div onClick={this.toggleView} className="eye-icon"><i class="fa-regular fa-eye"></i></div>}
                  </div>
                  {isValid!==null && isValid && <p style={{color: 'green'}}>Valid Password</p>}
                  {isValid!==null && !isValid && <p style={{color: 'red'}}>Invalid Password</p>}
                  {errorMsg!==null?<p style={{color: 'red'}}>{`* ${errorMsg}`}</p>:''}
                  <div>
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                  <button className="clkbtn" type="submit">
                    Login
                  </button>
                </div>
              </form>
              {/* signup form */}
              <div className="signup-box">
                <input
                  type="email"
                  className="name ele"
                  placeholder="Enter your mail"
                  value={signupmail}
                  onChange={this.changeMail}
                />
                <input
                  type="text"
                  className="email ele"
                  value={signupusername}
                  placeholder="Your Username"
                  onChange={this.changeSignUpUser}
                />
                <div className="password-eye">
                <input
                  type={isSignView?'text':'password'}
                  className="password ele"
                  value={signuppassword}
                  placeholder="Your Password"
                  onChange={this.changeSignUpPassword}
                />
                {!isSignView && <div onClick={this.toggleSignView} className="eye-icon"><i class="fa-regular fa-eye-slash"></i></div>}
                  {isSignView && <div onClick={this.toggleSignView} className="eye-icon"><i class="fa-regular fa-eye"></i></div>}
                </div>
                <input
                  type="password"
                  className="password ele"
                  placeholder="Confirm password"
                  value={signupconfirm}
                  onChange={this.changeConfirm}
                />
                {signErrMsg!==null?<p style={{color: 'red'}}>{`* ${signErrMsg}`}</p>:''}
                <button className="clkbtn" onClick={this.onSubmitSignUp}>
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPage);
