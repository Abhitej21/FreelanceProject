import { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { withRouter } from "react-router-dom";
import "./index.css";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

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
      signupname: "",
      errorMsg: null,
    };
  }

  componentDidMount() {
    this.props.history.push("/login");
  }
  // history = useHistory()
  // goToHome = token => {
  //     const {history} = this.props
  //     Cookies.set('jwt_token',token,{expires: 30})
  //     history.replace('/')
  // }
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
    const { signupconfirm, signupname, signuppassword, signupusername } = this.state;
    const newUser = {
      name: signupname,
      username: signupusername,
      password: signuppassword,
      confirm: signupconfirm,
    };
    const url = "http://localhost:8000/signup";
    console.log(newUser)
    axios
      .post(url, newUser)
      .then((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registration Successful",
          showConfirmButton: false,
          timer: 2000,
        });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  submitDetails = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const url = "http://localhost:8000/login";
    axios
      .post(url, { username, password })
      .then((res) => {
        console.log(res)
        
        if (res.data.userExists === false) {
          console.log("User not found");
          this.setErrorMsg('User not found')
          return <Redirect to="/login"/>
        } 
        else if(res.data.password === false){
          console.log("Password not matched")
          this.setErrorMsg('Incorrect password')
          return <Redirect to="/login"/>
        }
        else if (res.data.token !== undefined) {
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

  changeName = (event) => {
    this.setState({ signupname: event.target.value });
  };
  changeSignUpUser = (event) => {
    this.setState({ signupusername: event.target.value });
  };
  changeSignUpPassword = (event) => {
    this.setState({ signuppassword: event.target.value });
  };
  changeConfirm = (event) => {
    this.setState({ signupconfirm: event.target.value });
  };

  changeUserName = (event) => {
    this.setState({ username: event.target.value });
  };

  changePassword = (event) => {
    this.setState({ password: event.target.value ,errorMsg:null});
  };

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
    const { slider, formSection,isView,isSignView,errorMsg } = this.state;
    const jwtTokenUser = Cookies.get('jwt_token')
    if(jwtTokenUser !== undefined){
        this.props.history.push("/jobs")
    }
    return (
      <div className="image-background">
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
                    placeholder="Your UserName"
                    onChange={this.changeUserName}
                  />
                  <div className="password-eye">
                  <input
                    type={isView?'text':'password'}
                    className="password ele"
                    placeholder="Your Password"
                    onChange={this.changePassword}
                  />
                  {!isView && <div onClick={this.toggleView} className="eye-icon"><i class="fa-regular fa-eye-slash"></i></div>}
                  {isView && <div onClick={this.toggleView} className="eye-icon"><i class="fa-regular fa-eye"></i></div>}
                  </div>
                  {errorMsg!==null?<p style={{color: 'red'}}>{`* ${errorMsg}`}</p>:''}
                  <button className="clkbtn" type="submit">
                    Login
                  </button>
                </div>
              </form>
              {/* signup form */}
              <div className="signup-box">
                <input
                  type="text"
                  className="name ele"
                  placeholder="Enter your name"
                  onChange={this.changeName}
                />
                <input
                  type="text"
                  className="email ele"
                  placeholder="Your Username"
                  onChange={this.changeSignUpUser}
                />
                <div className="password-eye">
                <input
                  type={isSignView?'text':'password'}
                  className="password ele"
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
                  onChange={this.changeConfirm}
                />
                <button className="clkbtn" onClick={this.onSubmitSignUp}>
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
//       <div className="main-body">
//       <div className="section">
//   <div className="container">
//     <div className="row full-height justify-content-center">
//       <div className="col-12 text-center align-self-center py-5">
//         <div className="section pb-5 pt-5 pt-sm-2 text-center">
//           <h6 className="mb-0 pb-3">
//             <span>Log In </span>
//             <span>Sign Up</span>
//           </h6>
//           <input
//             className="checkbox"
//             type="checkbox"
//             id="reg-log"
//             name="reg-log"
//           />
//           <label htmlFor="reg-log" />
//           <div className="card-3d-wrap mx-auto">
//             <div className="card-3d-wrapper">
//               <div className="card-front">
//                 <div className="center-wrap">
//                   <div className="section text-center">
//                     <h4 className="mb-4 pb-3">Log In</h4>
//                     <div className="form-group">
//                       <input
//                         type="email"
//                         name="logemail"
//                         className="form-style"
//                         placeholder="Your Email"
//                         id="logemail"
//                         autoComplete="off"
//                       />
//                       <i className="input-icon uil uil-at" />
//                     </div>
//                     <div className="form-group mt-2">
//                       <input
//                         type="password"
//                         name="logpass"
//                         className="form-style"
//                         placeholder="Your Password"
//                         id="logpass"
//                         autoComplete="off"
//                       />
//                       <i className="input-icon uil uil-lock-alt" />
//                     </div>
//                     <a href="#" className="btn mt-4">
//                       submit
//                     </a>
//                     <p className="mb-0 mt-4 text-center">
//                       <a href="#0" className="link">
//                         Forgot your password?
//                       </a>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-back">
//                 <div className="center-wrap">
//                   <div className="section text-center">
//                     <h4 className="mb-4 pb-3">Sign Up</h4>
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         name="logname"
//                         className="form-style"
//                         placeholder="Your Full Name"
//                         id="logname"
//                         autoComplete="off"
//                       />
//                       <i className="input-icon uil uil-user" />
//                     </div>
//                     <div className="form-group mt-2">
//                       <input
//                         type="email"
//                         name="logemail"
//                         className="form-style"
//                         placeholder="Your Email"
//                         id="logemail"
//                         autoComplete="off"
//                       />
//                       <i className="input-icon uil uil-at" />
//                     </div>
//                     <div className="form-group mt-2">
//                       <input
//                         type="password"
//                         name="logpass"
//                         className="form-style"
//                         placeholder="Your Password"
//                         id="logpass"
//                         autoComplete="off"
//                       />
//                       <i className="input-icon uil uil-lock-alt" />
//                     </div>
//                     <a href="#" className="btn mt-4">
//                       submit
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
    );
  }
}

export default withRouter(LoginPage);
