import React from 'react';
// import Header from './Components/Header/index.js';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage.js';
import Dashboard from './pages/Dashboard.js';
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path='/' element={<SignupPage/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </Router>
    </>
    
  )
}

export default App;
