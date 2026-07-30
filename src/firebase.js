import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiMtje6DHi9Qlgo2A7wG5scm-331i8SwM",
  authDomain: "bakininmutfagi-308bc.firebaseapp.com",
  projectId: "bakininmutfagi-308bc",
  storageBucket: "bakininmutfagi-308bc.firebasestorage.app",
  messagingSenderId: "144844874028",
  appId: "1:144844874028:web:2d84414f2787a8e6604c89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
