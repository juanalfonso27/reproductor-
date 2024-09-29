// Import the functions you need from the SDKs you need
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js"></script>

<script>
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBSMzKJYdRgA_JM9lX0pUhfvwkZ5nAOBRM",
    authDomain: "reproductor-b1420.firebaseapp.com",
    projectId: "reproductor-b1420",
    storageBucket: "reproductor-b1420.appspot.com",
    messagingSenderId: "60164868284",
    appId: "1:60164868284:web:0f94e7e49eb6ee55bfe8b9"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize services
  const storage = firebase.storage();
  const db = firebase.firestore();
</script>
