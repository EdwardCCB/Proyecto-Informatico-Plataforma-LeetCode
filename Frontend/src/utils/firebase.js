import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyC-TDZnFPVFG1X2WZ_Wb8XRPrpuFeYKORM",
    authDomain: "gocode-70010.firebaseapp.com",
    projectId: "gocode-70010",
    storageBucket: "gocode-70010.firebasestorage.app",
    messagingSenderId: "1011344665830",
    appId: "1:1011344665830:web:94e9d6705606839c005f27",
    measurementId: "G-LR097LSRC6"
  };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)