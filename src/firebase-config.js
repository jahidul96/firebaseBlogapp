// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

    apiKey: process.env.APIKEY,

    authDomain: "demoproject-d6fd6.firebaseapp.com",

    projectId: "demoproject-d6fd6",

    storageBucket: "demoproject-d6fd6.appspot.com",

    messagingSenderId: "876347182764",

    appId: process.env.APPID

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);