import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5qUbSrdBAfo4RT2VTvtePGvULShVbjMU",
  authDomain: "spots-collector.firebaseapp.com",
  projectId: "spots-collector",
  storageBucket: "spots-collector.appspot.com",
  messagingSenderId: "888175990883",
  appId: "1:888175990883:web:bf27ccb0c955969a508056",
  measurementId: "G-XXGF59560Y"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };