// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'vermaestate-87bb7.firebaseapp.com',
  projectId: 'vermaestate-87bb7',
  storageBucket: 'vermaestate-87bb7.appspot.com',
  messagingSenderId: '155015156337',
  appId: '1:155015156337:web:ecca1a677203120f1b81d0',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
