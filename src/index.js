import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {// Import the functions you need from the SDKs you need
      apiKey: "AIzaSyCA3D7ia4L9fW_mQcbKPsnBjilWhL69Nsg",
      authDomain: "voice-recording-2f264.firebaseapp.com",
      projectId: "voice-recording-2f264",
      storageBucket: "voice-recording-2f264.appspot.com",
      messagingSenderId: "300225315939",
      appId: "1:300225315939:web:8c7645dfde01315b0ea456",
      measurementId: "G-0GESDKZQR1"
    };
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);