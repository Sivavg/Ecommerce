import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYrl7HEPKN0997pslAyHzD6RcwQ1KRNs8",
  authDomain: "ecommerce-8bfa0.firebaseapp.com",
  projectId: "ecommerce-8bfa0",
  storageBucket: "ecommerce-8bfa0.firebasestorage.app",
  messagingSenderId: "161524939859",
  appId: "1:161524939859:web:0b0dc2f2a5db8d9cc21aa6",
  measurementId: "G-B5M47S46JV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
