import logo from './logo.svg';
import './App.css';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
 } from 'react-router-dom';
import Home from './View/Home';
import Udesh from './View/Udesh';
import Cometee from './View/Cometee';
import Donation from './View/Donation';
import Help from './View/Help';
import Gallary from './View/Gallary';
import Contact from './View/Contact';
import Login from './View/Login';
import DonationHistory from './View/DonationHistory';
import Profile from './View/Profile';
import SignUp from './View/SignUp';
import AssignRole from './Role/AssignRole';
 
function App() {
  return (
    <>
      <Router  basename="/">
        <Switch >
        <Route exact path ="/">
          <Home  />
        </Route>
        <Route exact path ="/Home">
          <Home  />
        </Route>
        <Route exact path ="/Udesh">
          <Udesh  />
        </Route>
        <Route exact path ="/Cometee">
          <Cometee  />
        </Route>
        <Route exact path ="/Donation">
          <Donation  />
        </Route>
        <Route exact path ="/Help">
          <Help  />
        </Route>
        <Route exact path ="/Gallary">
          <Gallary  />
        </Route>
        <Route exact path ="/Contact">
          <Contact  />
        </Route>
        <Route exact path ="/DonationHistory">
          <DonationHistory  />
        </Route>
        <Route exact path ="/Profile">
          <Profile  />
        </Route>
         <Route exact path="/login" >
         <Login/>
         </Route>
        <Route exact path="/signup">
          <SignUp/>
        </Route>
        <Route exact path="/assign-role">
          <AssignRole/>
        </Route>
      </Switch>
      </Router>
    </>
  );
}

export default App;
