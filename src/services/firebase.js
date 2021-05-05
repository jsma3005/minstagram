import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAobVW1uefa8xkuHrWOCVZDoLeu9ZS31TA",
    authDomain: "disc-87cd4.firebaseapp.com",
    databaseURL: "https://disc-87cd4.firebaseio.com",
    projectId: "disc-87cd4",
    storageBucket: "disc-87cd4.appspot.com",
    messagingSenderId: "787820010297",
    appId: "1:787820010297:web:ea1f0d81a1faac50e426e8"
};

export const fire = firebase;
firebase.initializeApp(firebaseConfig);