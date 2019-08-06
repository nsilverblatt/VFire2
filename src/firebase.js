import {initializeApp}from 'firebase'

const app = initializeApp({
  apiKey: "AIzaSyBRu88i7Wgf71zM_kP8x89TqKmAO50OE78",
  authDomain: "fir-vue-28c2d.firebaseapp.com",
  databaseURL: "https://fir-vue-28c2d.firebaseio.com",
  projectId: "fir-vue-28c2d",
  storageBucket: "",
  messagingSenderId: "964801298391",
  appId: "1:964801298391:web:de85969457f346de"
});

export const db = app.database();
export const namesRef = db.ref('names');
export const totalVotes = db.ref('totalValues');


