// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Importar Firebase Firestore si necesitas base de datos en tiempo real
import { getFirestore } from "firebase/firestore";

// Importar Firebase Storage para subir y almacenar los videos
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSMzKJYdRgA_JM9lX0pUhfvwkZ5nAOBRM",
  authDomain: "reproductor-b1420.firebaseapp.com",
  projectId: "reproductor-b1420",
  storageBucket: "reproductor-b1420.appspot.com",
  messagingSenderId: "60164868284",
  appId: "1:60164868284:web:0f94e7e49eb6ee55bfe8b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);