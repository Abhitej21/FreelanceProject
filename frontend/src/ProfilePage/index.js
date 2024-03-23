import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./index.css";
import Swal from "sweetalert2";
import MainHeader from "../MainHeader";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import Webcam from "react-webcam";

const skillsOptions = [
  "React",
  "JavaScript",
  "HTML",
  "CSS",
  "Node.js",
  "Python",
  "Java",
  "Ruby",
  "C++",
  "Other",
];

const videoConstraints = {
  width: 330,
  height: 280,
  facingMode: "user",
};

const ProfilePage = () => {
  
//   const history = useHistory();
//   useEffect(() => {
//     alert("PUSHING NOW");
//     history.push("/jobs");
//   }, []);console.log("jhgfdfgh");
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [userExists, setUserExists] = useState(true);
  useEffect(() => {
    if (!files) return;
    let temp = [];
    for (let i = 0; i < files.length; i++) {
      temp.push(URL.createObjectURL(files[i]));
    }
    const objUrl = temp;
    setPreviews(objUrl);
    setUserDetails({ ...userDetails, profileUrl: objUrl[0] });
    for (let i = 0; i < objUrl.length; i++) {
      return () => {
        URL.revokeObjectURL(objUrl[i]);
      };
    }
  }, [files]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    userId: "",
    username: "",
    firstname: "",
    lastname: "",
    org: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: [],
    bio: "",
    dob: "",
    location: "",
    phone: "",
    about: "",
    github: "",
    linkedin: "",
    profileUrl: "",
    prevData: {},
  });
  useEffect(() => {
    async function fetchUsername() {
      const jwtToken = Cookies.get("jwt_token");
      const newUrl = `http://localhost:8000/profile/${id}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const DataFetching = await fetch(newUrl, options);
      const DetailsOfUser = await DataFetching.json();
      // console.log("My Data",DetailsOfUser)
      const { username, data, userId } = DetailsOfUser;
      // console.log(data)
      if (data && data.isNull === true) {
        setUserExists(false);
      }
      setUserDetails({
        ...userDetails,
        username: username,
        userId: userId,
        firstname: (data && data.firstName) || "",
        lastname: (data && data.lastName) || "",
        org: (data && data.org) || "",
        email: (data && data.email) || "",
        bio: (data && data.userBio) || "",
        skills: (data && data.userSkills) || [],
        dob: (data && data.dob) || "",
        location: (data && data.location) || "",
        phone: (data && data.phone) || "",
        github: (data && data.github) || "",
        about: (data && data.userAbout) || "",
        linkedin: (data && data.linkedin) || "",
        profileUrl: (data && data.profileUrl) || "",
        prevData: data,
      });
      setIsLoading(false);
    }
    fetchUsername();
  }, []);

  const inputRef = React.useRef(null);

  const onImageClick = () => {
    inputRef.current.click();
  };

  const { id } = useParams();

  const handleUsernameChange = (event) =>
    setUserDetails({ ...userDetails, username: event.target.value });
  const handleFirstNameChange = (event) =>
    setUserDetails({ ...userDetails, firstname: event.target.value });
  const handleLastNameChange = (event) =>
    setUserDetails({ ...userDetails, lastname: event.target.value });
  const handleOrgNameChange = (event) =>
    setUserDetails({ ...userDetails, org: event.target.value });
  const handleLocationChange = (event) =>
    setUserDetails({ ...userDetails, location: event.target.value });
  const handleEmailChange = (event) =>
    setUserDetails({ ...userDetails, email: event.target.value });
  const handleBioChange = (event) =>
    setUserDetails({ ...userDetails, bio: event.target.value });
  const handlePhoneChange = (event) =>
    setUserDetails({ ...userDetails, phone: event.target.value });
  const handleAboutChange = (event) =>
    setUserDetails({ ...userDetails, about: event.target.value });
  const handleBirthdayChange = (event) =>
    setUserDetails({ ...userDetails, dob: event.target.value });
  const handleSkillChange = (event) => {
    const newSkill = event.target.value;
    setUserDetails({
      ...userDetails,
      skills: userDetails.skills.includes(newSkill)
        ? [...userDetails.skills]
        : [...userDetails.skills, newSkill],
    });
  };

  const handleGithubUrlChange = (event) =>
    setUserDetails({ ...userDetails, github: event.target.value });
  const handleLinkedInUrlChange = (event) =>
    setUserDetails({ ...userDetails, linkedin: event.target.value });

  // CAMERA RELATED OPTIONS
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  const submitPhoto = (event) => {
    console.log(typeof url);
    const postUrl = `http://localhost:8000/profile/${userDetails.username}`;
    const newDetails = { ...userDetails, profileUrl: url };
    axios
      .post(postUrl, newDetails)
      .then((response) => {
        console.log(response);
        alert("Profile Picture Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitDetails = async (event) => {
    event.preventDefault();
    const {
      username,
      firstname,
      lastname,
      phone,
      dob,
      userBio,
      org,
      email,
      userAbout,
      userSkills,
      location,
      github,
      linkedin,
      profileUrl,
    } = userDetails;
    const newDetails = {
      username,
      firstname,
      lastname,
      phone,
      org,
      dob,
      userBio,
      email,
      userAbout,
      userSkills,
      location,
      github,
      linkedin,
      profileUrl,
    };
    const postUrl = `http://localhost:8000/profile/${userDetails.username}`;
    axios
      .post(postUrl, newDetails)
      .then((response) => {
        // console.log(response)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Profile Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        // alert("Profile Updated Successfully")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Redirect to="/login" />;
  }
  const { username, prevData, userId } = userDetails;
  if (userExists === false) {
    return (
      <div className="no-user-found">
        <img
          src="https://res.cloudinary.com/da7y99axc/image/upload/v1710580985/Profiling-rafiki_cll0ze.png"
          alt="No User Found"
        />
        <h1>{`NO USER FOUND ${"\u{1F9D0}"}`}</h1>
      </div>
    );
  }
  if (isLoading === true) {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    );
  }
  let userData = {};
  if (prevData !== undefined) {
    userData = prevData;
  }
  return (
    <div className="main-form">
      {/* Account page navigation*/}
      <MainHeader />
      {/* <hr className="mt-0 mb-4" /> */}
      <div className="row form-bottom">
        <div className="col-md-4">
          {/* Profile picture card*/}
          <div className="card mb-4 mb-lg-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              {/* Profile picture image*/}
              {previews && (
                <img
                  src={previews[0]}
                  alt="No Profile Picture"
                  className="img-account-profile rounded-circle mb-2"
                />
              )}
              {/* Profile picture help block*/}
              <div className="small font-italic text-muted mb-4">
                JPG or PNG no larger than 5 MB
              </div>
              {/* Profile picture upload button*/}
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onImageClick}
                >
                  <input
                    type="file"
                    ref={inputRef}
                    style={{ display: "none" }}
                    accept="image/jpg, image/jpeg, image/png"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFiles(e.target.files);
                      }
                    }}
                  />
                  {/* <input type="file" onChange={onChangeImage} ref={inputRef} style={{display: "none"}}/> */}
                  Change Image
                </button>
              </div>

              <div>
                {isCaptureEnable || (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCaptureEnable(true)}
                  >
                    <span>
                      <i
                        class="fa-solid fa-camera"
                        style={{ fontColor: "white", marginRight: "10px" }}
                      ></i>
                      Take a photo
                    </span>
                  </button>
                )}
                {isCaptureEnable && (
                  <>
                    <div>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setCaptureEnable(false)}
                      >
                        Close
                      </button>
                    </div>
                    {url === null ? (
                      <>
                        <div className="video-block">
                          <Webcam
                            audio={false}
                            width={540}
                            height={360}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                          />
                        </div>
                        <button
                          className="btn btn-outline-info"
                          onClick={capture}
                        >
                          capture
                        </button>
                      </>
                    ) : (
                      <div>
                        <img src={url} alt="Screenshot" />
                      </div>
                    )}
                  </>
                )}
                {url && (
                  <>
                    <div className="d-flex justify-content-space-between">
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setUrl(null);
                        }}
                      >
                        Retake
                      </button>

                      <button className="btn btn-success" onClick={submitPhoto}>
                        Use Photo
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          {/* Account details card*/}
          <div className="card mb-4">
            <div className="card-header">Account Details</div>
            <div className="card-body">
              <form onSubmit={submitDetails}>
                {/* Form Group (username)*/}
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputUsername">
                    Username (how your name will appear to other users on the
                    site)
                  </label>
                  <input
                    className="form-control"
                    id="inputUsername"
                    type="text"
                    value={userId}
                    disabled={true}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>
                {/* Form Row*/}
                <div className="row gx-3 mb-3">
                  {/* Form Group (first name)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputFirstName">
                      First name
                    </label>
                    <input
                      className="form-control"
                      id="inputFirstName"
                      type="text"
                      defaultValue={
                        userData.firstName === undefined
                          ? ""
                          : userData.firstName
                      }
                      onChange={handleFirstNameChange}
                      disabled={username !== userId}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  {/* Form Group (last name)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLastName">
                      Last name
                    </label>
                    <input
                      className="form-control"
                      id="inputLastName"
                      type="text"
                      defaultValue={
                        userData.lastName === undefined ? "" : userData.lastName
                      }
                      disabled={username !== userId}
                      onChange={handleLastNameChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="bio">
                    Bio
                  </label>
                  <input
                    className="form-control"
                    id="bio"
                    type="bio"
                    defaultValue={
                      userData.userBio === undefined ? "" : userData.userBio
                    }
                    disabled={username !== userId}
                    onChange={handleBioChange}
                    placeholder="Enter your Bio"
                    required
                  />
                </div>

                {/* Form Row        */}
                <div className="row gx-3 mb-3">
                  {/* Form Group (organization name)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputOrgName">
                      Organization name
                    </label>
                    <input
                      className="form-control"
                      id="inputOrgName"
                      type="text"
                      disabled={username !== userId}
                      defaultValue={
                        userData.org === undefined ? "" : userData.org
                      }
                      onChange={handleOrgNameChange}
                      placeholder="Enter your organization name"
                      required
                    />
                  </div>
                  {/* Form Group (location)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLocation">
                      Location
                    </label>
                    <input
                      className="form-control"
                      id="inputLocation"
                      type="text"
                      onChange={handleLocationChange}
                      defaultValue={
                        userData.location === undefined ? "" : userData.location
                      }
                      disabled={username !== userId}
                      placeholder="Enter your location"
                      required
                    />
                  </div>
                </div>
                {/* Form Group (email address)*/}
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputEmailAddress">
                    Email address
                  </label>
                  <input
                    className="form-control"
                    id="inputEmailAddress"
                    type="email"
                    defaultValue={
                      userData.email === undefined ? "" : userData.email
                    }
                    disabled={username !== userId}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                {/* Form Row*/}
                <div className="row gx-3 mb-3">
                  {/* Form Group (phone number)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputPhone">
                      Phone number
                    </label>
                    <input
                      className="form-control"
                      id="inputPhone"
                      disabled={username !== userId}
                      defaultValue={
                        userData.phone === undefined ? "" : userData.phone
                      }
                      type="tel"
                      onChange={handlePhoneChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  {/* Form Group (birthday)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputBirthday">
                      Date of Birth
                    </label>
                    <input
                      className="form-control"
                      id="inputBirthday"
                      type="date"
                      name="birthday"
                      disabled={username !== userId}
                      defaultValue={
                        userData.dob === undefined
                          ? ""
                          : userData.dob.split("T")[0]
                      }
                      onChange={handleBirthdayChange}
                      placeholder="Enter your birthday"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 all-skills">
                  {userDetails.userSkills &&
                    userDetails.userSkills.map((each) => {
                      const skillname = each;
                      return <span className="skill-box">{skillname}</span>;
                    })}
                </div>
                <div className="row mb-3 gx-3">
                  <div className="col-12">
                    <label className="small" htmlFor="skill">
                      Select a Skill:
                    </label>
                    <select
                      id="skill"
                      name="skill"
                      className="form-control"
                      onChange={handleSkillChange}
                      required
                    >
                      <option value="" disabled>
                        -- Select a Skill --
                      </option>
                      {skillsOptions.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small mb-1" htmlFor="userAbout">
                    About
                  </label>
                  <textarea
                    className="form-control"
                    id="userAbout"
                    type="textarea"
                    defaultValue={
                      userData.userAbout === undefined ? "" : userData.userAbout
                    }
                    disabled={username !== userId}
                    onChange={handleAboutChange}
                    placeholder="Write about yourself..."
                    required
                  ></textarea>
                </div>

                <div className="row mb-3 gx-3">
                  <div className="col-12">
                    <label className="small mb-1" htmlFor="url">
                      Enter github url
                    </label>
                    <input
                      className="form-control"
                      type="url"
                      name="url"
                      id="url"
                      disabled={username !== userId}
                      defaultValue={
                        userData.github === undefined ? "" : userData.github
                      }
                      onChange={handleGithubUrlChange}
                      placeholder="https://github.com"
                      pattern="https://github.*"
                      size="30"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 gx-3">
                  <div className="col-12">
                    <label className="small mb-1" htmlFor="url">
                      Enter LinkedIn url
                    </label>
                    <input
                      className="form-control"
                      onChange={handleLinkedInUrlChange}
                      type="url"
                      name="url"
                      id="url"
                      disabled={username !== userId}
                      defaultValue={
                        userData.linkedin === undefined ? "" : userData.linkedin
                      }
                      placeholder="https://linked.com"
                      pattern="https://.*"
                      size="30"
                      required
                    />
                  </div>
                </div>

                {/* Save changes button*/}
                <button className="btn btn-primary" type="submit">
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
