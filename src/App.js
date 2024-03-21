import LoginPage from './LoginPage';
import {Route,Redirect} from 'react-router-dom'
import './App.css';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Home from './Home';
import SearchPage from './AdvancedSearch';
import ImageLogo from './ImageLogo';
import JobsDetails from './JobsData';
import JobItemDetails from './jobItemDetails';
import ProtectedRoute from './ProtectedRoute';
import ShowStarred from './ShowStarred';
import ProfilePage from './ProfilePage';
import MainHeader from './MainHeader';
import ApplyForm from './ApplyForm/index.js';
import LatestJobs from './LatestJobs/index.js';
import FeedbackForm from './FeedbackForm/index.js';
import { CameraOption } from './CameraOption/index.js';
import AppliedJobs from './AppliedJobs/index.js';



const App = () => (
    <Switch>

      <Route exact path="/camera" component={CameraOption}/>
      <Route exact path="/login" component={LoginPage}/>
      <Route exact path="/" component={Home}/>
      <Route exact path="/header" component={MainHeader}/>
      <Route exact path="/search" component={SearchPage}/>
      <Route exact path="/image" component={ImageLogo}/>
      <Route exact path="/jobs" component={JobsDetails} />  
      <Route exact path="/apply/:id" component={ApplyForm}/>
      <Route exact path="/savedjobs" component={ShowStarred}/>
      <Route exact path="/profile/:id" component={ProfilePage}/>
      <Route exact path="/jobs/:id" component={JobItemDetails} />
      <Route exact path="/latestjobs" component={LatestJobs}/>
      <Route exact path="/feedback" component={FeedbackForm}/>
      <Route exact path="/appliedjobs" component={AppliedJobs}/>
</Switch>


    
  )


export default App;
