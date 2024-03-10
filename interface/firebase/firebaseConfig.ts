import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxNHNi_AXLiGrq1oUyleTqpmv2hdIdceo",
  authDomain: "buskingproject-c1409.firebaseapp.com",
  projectId: "buskingproject-c1409",
  storageBucket: "buskingproject-c1409.appspot.com",
  messagingSenderId: "310167708337",
  appId: "1:310167708337:web:55fabd3fc4d54d5126f890",
  measurementId: "G-BRZT7PMBJS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };