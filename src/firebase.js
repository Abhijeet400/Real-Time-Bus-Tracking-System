// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAEC-V1v6CS4l-x2WZdB_DZGgVWdObyaR8",
  authDomain: "real-time-bus-tracking-s-48a18.firebaseapp.com",
  databaseURL: "https://real-time-bus-tracking-s-48a18-default-rtdb.firebaseio.com",
  projectId: "real-time-bus-tracking-s-48a18",
  storageBucket: "real-time-bus-tracking-s-48a18.firebasestorage.app",
  messagingSenderId: "260810642446",
  appId: "1:260810642446:web:61506e13ed00bd89f2185f",
  measurementId: "G-BDC0DTW5KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime Database instance
export const db = getDatabase(app);
