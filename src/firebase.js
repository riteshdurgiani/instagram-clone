import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCgi3MkqI2dzCdbiH2L18kDgMKMCsVdXqs",
    authDomain: "instagram-clone-778de.firebaseapp.com",
    databaseURL: "https://instagram-clone-778de.firebaseio.com",
    projectId: "instagram-clone-778de",
    storageBucket: "instagram-clone-778de.appspot.com",
    messagingSenderId: "429798258812",
    appId: "1:429798258812:web:aa614ecb768a312e0e71f9",
    measurementId: "G-YZMFL414CQ"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }