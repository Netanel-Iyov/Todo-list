// import { set } from "mongoose";
import React from 'react';
import HomePage from "./components/Home"
import LoginPage from "./components/Login" 
//import { BrowserRouter as Router, Routes, Route, redirect as Redirect} from 'react-router-dom';

const App = () => {
    return (
        // <Router>
        //   <Routes>
        //     <Route exact path="/home" component={HomePage} />
        //     <Route exact path="/login" component={LoginPage} />
        //     <Redirect from="/" to="/login" />
        //   </Routes>
        // </Router>
        <div>
            <LoginPage />
        </div>
      );
};

export default App;
