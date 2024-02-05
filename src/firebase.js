// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import {getFirestore,doc,setDoc} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIJBasYYj3rWvu725vjSR8ng_ro3lwcPg",
  authDomain: "finacely-project-43820.firebaseapp.com",
  projectId: "finacely-project-43820",
  storageBucket: "finacely-project-43820.appspot.com",
  messagingSenderId: "314352767516",
  appId: "1:314352767516:web:c98eaa90100733196905d9",
  measurementId: "G-TST4K1XXC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};