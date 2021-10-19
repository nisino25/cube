import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyDBwJBOnd7NfkvlXQqppuAfYbvwV7VZwLI",
  authDomain: "cube-data.firebaseapp.com",
  projectId: "cube-data",
  storageBucket: "cube-data.appspot.com",
  messagingSenderId: "230436987651",
  appId: "1:230436987651:web:9361412f94a966b067bf36",
  measurementId: "G-0PR691JK7M"
};

const db = firebase.initializeApp(config);
export default db;