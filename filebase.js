import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, uploadBytes, ref  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-7JNegL_AO4qSMUgrckyr0xVGhAUuU7E",
  authDomain: "soundboard-noralg1.firebaseapp.com",
  projectId: "soundboard-noralg1",
  storageBucket: 'soundboard-noralg1.appspot.com',
  messagingSenderId: "772683663137",
  appId: "1:772683663137:web:01c127d0fe70dab319a060"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getStorage(app);

//const soundsOneRef = ref(db, 'sounds/One.mp3')


const form = document.getElementById("form")
const mainGrid = document.getElementById("main-grid")

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const formData = new FormData(form)
    const file = formData.get("file")
    const name = formData.get("name")

    const fileRef = ref(db, name);

    uploadBytes(fileRef, file)
    console.log(file)
    console.log(name)
    
})

/* THE FILE UPLOADED SUCCESSFULLY*/
 
fetch('https://firebasestorage.googleapis.com/v0/b/soundboard-noralg1.appspot.com/o/')
                .then(data => data.json())
                .then(response => console.log(response.items))

for (let i=0;i<10;i++){
    mainGrid.innerHTML += `<button>SOUND1</button>`
}