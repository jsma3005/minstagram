import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCnuP4Yl5V7rW633Wa9_sqrsJsv45hU-YQ",
    authDomain: "jsma-minstagram.firebaseapp.com",
    databaseURL: "https://jsma-minstagram-default-rtdb.firebaseio.com",
    projectId: "jsma-minstagram",
    storageBucket: "jsma-minstagram.appspot.com",
    messagingSenderId: "1013964593692",
    appId: "1:1013964593692:web:f428f9ac30f63da3779dd9"
};

export const fire = firebase;
export const provider = new firebase.auth.GoogleAuthProvider();
firebase.initializeApp(firebaseConfig);