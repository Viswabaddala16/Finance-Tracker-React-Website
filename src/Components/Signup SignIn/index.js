import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import Button from '../Button';
import './style.css';
import '../../index.css';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth,db, provider} from '../../firebase';
import {signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore"; 
import { toast } from 'react-toastify';



function SignupSinginComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conformPassword, setConformPassword] = useState('');
  const [loading, setLoading] = useState('');
  const[loginForm,setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("button is clicked");
    if (name !== '' && email !== '' && password !== '' && conformPassword !== '') {
      if (password === conformPassword) {
        createUserWithEmailAndPassword(auth , email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success("User is Created")
            console.log(user);
            console.log("name",name);
            console.log("email",email);
            console.log("password",password);
            console.log("conform Password",conformPassword);
            setName('');
            setLoading(false);
            setEmail('');
            setPassword('');
            setConformPassword('');
            createDoc(user);
            navigate('/dashboard');
          })
          .catch((error) => {
            const errorMessage = error.message;
            const errorCode = error.code;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else{
        toast.error("password and conform password are should be same");
        setLoading(false);
      }
    }
    else{
      toast.error("All Fields are Mandatory");
      setLoading(false);
    }
  }
  function loginWithEmail(){
    console.log("email",email);
  }
  function loginWithEmail(){
    console.log("login button is cliked");
    if (email !== '' && password !== ''){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
        navigate('/dashboard');
        toast.success("user is Logined")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ..
      });
    }else {
      toast.error("All Fields Are Mandatory");
    }
  }
// async  function createDoc(user){
//   setLoading(true);
//   // if (!navigator.onLine) {
//   //   toast.error("You are currently offline. Please check your internet connection.");
//   //   setLoading(false);
//   //   return;
//   // }
//   if(!user) return;

//   const useRef = doc(db,"users",user.uid)
//   const userData = await getDoc(useRef);
//   if(!userData.exists()){
//     try{
//       await setDoc(doc(db, "users", "user.uid"),{
//         name : user.displayName ? user.displayName :name,
//         email : user.email,
//         photoURL : user.photoURL ? user.photoURL : "",
//         createdAt : new Date(),
//       });
//       toast.success("Doc created!");
//       setLoading(false);
//     }catch(e){
//       toast.error(e.errorMessage);
//       setLoading(false);
//     }
//   }else{
//     toast.error("Doc is Already exists");
//     setLoading(false);
//   }
 
// }
async function signupWithGoogle() {
  setLoading(true);
  try {
    await signOut(auth);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user>>",user);
        createDoc(user);
        toast.success("User Authenticated");       
        setLoading(false);
        navigate('/dashboard');
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("google authentication error",errorCode,errorMessage);
        setLoading(false);
        toast.error(errorMessage);
        // ...
      });
  } catch (e) {
    toast.error(e.message);
  }
}
async function createDoc(user) {
  setLoading(true);
  // if (!navigator.onLine) {
  //   toast.error("You are currently offline. Please check your internet connection.");
  //   setLoading(false);
  //   return;
  // }
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userData = await getDoc(userRef);

  if (!userData.exists()) {
    try {
      await setDoc(userRef, {
        name: user.displayName ? user.displayName : name,
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
      });
      toast.success("Doc created!");
      setLoading(false);
    } catch (e) {
      toast.error(e.errorMessage);
      setLoading(false);
    }
  } else {
    toast.error("Doc is Already exists");
    setLoading(false);
  }
}


  return (

    <>
      {loginForm ? 
      (
      <div className="signupWrapper">
          <h2 className="title">
            Login On <span style={{ color: 'blue' }}>Financely.</span>
          </h2>
          <form>
            <Input type="email" label={'Email'} 
            state={email} placeholder={'JohnDoe@gmail.com'} 
            setState={setEmail} />
            <Input type="password" label={'Password'}
            state={password} placeholder={'Example@123'} 
            setState={setPassword} />
            
            <Button text={ loading ? 'loadinng..' : 'Login With Email and Password'} onClick={loginWithEmail} blue={true} disabled = {loading}/>
            <p className='p-login'>Or</p>
            <Button text={ loading ? 'loading..':'Login With Google'} disabled = {loading} onClick={signupWithGoogle} />
            <p className='p-login' style={{cursor: "pointer"}} onClick={() => setLoginForm(!loginForm)} > Or Have An Already Account?Click Here</p>
          </form>
        </div>
      ): 
      (
        <div className="signupWrapper">
            <h2 className="title">
              Signup On <span style={{ color: 'blue' }}>Financely.</span>
            </h2>
            <form>
              <Input label={'full Name'} state={name} placeholder={'John Doe'} setState={setName} />
              <Input type="email" label={'Email'} state={email} placeholder={'JohnDoe@gmail.com'} setState={setEmail} />
              <Input type="password" label={'Password'} state={password} placeholder={'Example@123'} setState={setPassword} />
              <Input
                type="password"
                label={'Conform Password'}
                state={conformPassword}
                placeholder={'Example@123'}
                setState={setConformPassword}
              />
              <Button text={ loading ? 'loading..' : 'Signup With Email and Password'} onClick={signupWithEmail} blue={true} disabled = {loading}/>
              <p className='p-login'>Or</p>
              <Button text={ loading ? 'loading..':'Signup With Google'} disabled = {loading} onClick={signupWithGoogle}/>
              <p className='p-login' style={{cursor:"pointer"}} onClick={() => setLoginForm(!loginForm)}>Or Have An Already Account?Clickhere</p>
            </form>
        </div>
      )
    }
      
    </>
  );
}

export default SignupSinginComponent;
