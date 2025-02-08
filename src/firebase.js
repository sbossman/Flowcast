import configData from '../config.json'

// I DON'T KNOW WHERE THIS SHOULD BEEEEEEEEEEEEEEEEE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = configData.firebaseConfig;


// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
const analytics = getAnalytics(firebaseApp);

// used for the firestore refs
export const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const todosRef = collection(db, 'todos')
// END OF STUFF I'M CONFOOZED ABT
