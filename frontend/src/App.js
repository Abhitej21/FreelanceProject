import LoginPage from "./LoginPage";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import SearchPage from "./AdvancedSearch";
import ImageLogo from "./ImageLogo";
import JobsDetails from "./JobsData";
import JobItemDetails from "./jobItemDetails";
import ProtectedRoute from "./ProtectedRoute";
import ShowStarred from "./ShowStarred";
import ProfilePage from "./ProfilePage";
import MainHeader from "./MainHeader";
import ApplyForm from "./ApplyForm/index.js";
import LatestJobs from "./LatestJobs/index.js";
import FeedbackForm from "./FeedbackForm/index.js";
import { CameraOption } from "./CameraOption/index.js";
import AppliedJobs from "./AppliedJobs/index.js";
import ChatBot from "./ChatBot/index.js";
import ChangePassword from "./ChangePassword/index.js";
import Invitations from "./Invitations/index.js";
import ForgotPassword from "./ForgotPassword/index.js";
import ResetPassword from "./ResetPassword/index.js";


const App = () => (
  <>
  {/* <LoginPage/> */}
    {/* <ChangePassword/>  */}
           <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/jobs" component={JobsDetails} />
        
        <Route exact path="/camera" component={CameraOption} />
        
        
        <Route exact path="/header" component={MainHeader} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/image" component={ImageLogo} />

        <Route exact path="/apply/:id" component={ApplyForm} />
        <Route exact path="/jobs/saved" component={ShowStarred} />
        <Route exact path="/jobs/latest" component={LatestJobs} />
        <Route exact path="/jobs/applied" component={AppliedJobs} />
        <Route exact path="/jobs/invitations" component={Invitations}/>
        <Route exact path="/profile/:id" component={ProfilePage} />
        <Route exact path="/jobs/:id" component={JobItemDetails} />
        <Route exact path="/feedback" component={FeedbackForm} />
        <Route exact path="/forgot-password" component={ForgotPassword}/>
        <Route exact path="/reset-password/:id/:token" component={ResetPassword}/>
        
      </Switch>
     {/* <ChatBot/> */}
     </>
  );

export default App;
