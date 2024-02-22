// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE7ZXRG8gry2nK3jURV2YhJ55YLTLGsE8",
  authDomain: "react-d1f60.firebaseapp.com",
  projectId: "react-d1f60",
  storageBucket: "react-d1f60.appspot.com",
  messagingSenderId: "561396323401",
  appId: "1:561396323401:web:2c0552a492689b5ef91b98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
export {app, database}