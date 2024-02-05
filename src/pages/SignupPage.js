import React from 'react';
import SignupSinginComponent from '../Components/Signup SignIn';
import '../App.css';
import Header from '../Components/Header';
function SignupPage() {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <SignupSinginComponent/>
      </div>
      
    </div>
  )
}

export default SignupPage
