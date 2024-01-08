import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, uploadBytes, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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

const form = document.getElementById("form");
const mainGrid = document.getElementById("main-grid");

// Function to fetch existing sound files and create elements
async function fetchAndCreateSoundElements() {
  const storageRef = ref(db);

  // List all items in the storage
  const storageItems = await listAll(storageRef);

  // Loop through the items and create elements for each sound
  for (const item of storageItems.items) {
    const downloadURL = await getDownloadURL(item);
    const audioPlayer = createAudioPlayer(downloadURL, item.name);

    // Add play button
    const playButton = document.createElement("button");
    playButton.textContent = `${item.name}`;
    playButton.addEventListener("click", () => playSound(audioPlayer));

    // Add elements to the grid
    mainGrid.appendChild(playButton);
    mainGrid.appendChild(audioPlayer);
  }
}

// Fetch and create sound elements when the page loads
fetchAndCreateSoundElements();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const file = formData.get("file");
  const name = formData.get("name");

  // Check if the file is an audio file
  if (file && file.type.startsWith("audio/")) {
    const fileRef = ref(db, name);

    await uploadBytes(fileRef, file);
    console.log(`File ${name} uploaded successfully`);

    // Update the sound player with the new file URL
    const downloadURL = await getDownloadURL(fileRef);
    const audioPlayer = createAudioPlayer(downloadURL, name);

    // Add play button
    const playButton = document.createElement("button");
    playButton.textContent = `${name}`;
    playButton.addEventListener("click", () => playSound(audioPlayer));

    // Add elements to the grid
    mainGrid.appendChild(playButton);
    mainGrid.appendChild(audioPlayer);
  } else {
    console.log("Invalid file type. Please upload an audio file.");
  }
});

// Function to play the sound
function playSound(audioPlayer) {
  audioPlayer.play();
}

// Function to create an audio player
function createAudioPlayer(src, id) {
  const audioPlayer = document.createElement("audio");
  audioPlayer.src = src;
  audioPlayer.id = `audio-player-${id}`;
  audioPlayer.controls = true;
  return audioPlayer;
}
