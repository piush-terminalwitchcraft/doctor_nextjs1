// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFqLS8tJeRgzroJihZDll2HlXXeXEY42E",
  authDomain: "ayurveda-b77c3.firebaseapp.com",
  projectId: "ayurveda-b77c3",
  storageBucket: "ayurveda-b77c3.appspot.com",
  messagingSenderId: "893384841144",
  appId: "1:893384841144:web:0b601d53271808f2e9214d",
  measurementId: "G-2DFFW8LT1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export const auth = getAuth(app); 