// import firebase from 'firebase/compat/app';
import firebase from 'firebase/app'
import 'firebase/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0uoXq_3lNGgs5cWtYadxaBeuYjDZwa2Y",
  authDomain: "cube-fb83a.firebaseapp.com",
  projectId: "cube-fb83a",
  storageBucket: "cube-fb83a.appspot.com",
  messagingSenderId: "830203564641",
  appId: "1:830203564641:web:9f630c7358ff9968ad9020"
};

 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;