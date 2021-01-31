import { createApp } from 'vue'
import App from './App.vue'
import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9C6EbhBw9MhkMzuLKiT9EzHFPtGF2JcY",
  authDomain: "cube-7ed3e.firebaseapp.com",
  projectId: "cube-7ed3e",
  storageBucket: "cube-7ed3e.appspot.com",
  messagingSenderId: "114043201523",
  appId: "1:114043201523:web:06aacc0d0dcd0dbe261486",
  measurementId: "G-4FRF3JT0GK"
};

firebase.initializeApp(firebaseConfig)

// import Vue from "vue";

// import VueEllipseProgress from 'vue-ellipse-progress';
{/* <script src="https://cdn.jsdelivr.net/npm/vue-ellipse-progress/dist/vue-ellipse-progress.umd.min.js"></script> */}


createApp(App).mount('#app')

