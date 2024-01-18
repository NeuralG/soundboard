import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import {
	getStorage,
	uploadBytes,
	ref,
	listAll,
	getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"
import { firebaseConfig } from "./firebaseConfig"

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getStorage(app)

const form = document.getElementById("form")
const mainGrid = document.getElementById("main-grid")

let currentlyPlayingAudio = null

// Function to fetch existing sound files and create elements
async function fetchAndCreateSoundElements() {
	const storageRef = ref(db)

	// List all items in the storage
	const storageItems = await listAll(storageRef)

	// Loop through the items and create elements for each sound
	for (const item of storageItems.items) {
		const downloadURL = await getDownloadURL(item)
		const audioPlayer = createAudioPlayer(downloadURL, item.name)

		// Add play button
		const playButton = document.createElement("button")
		playButton.textContent = `${item.name}`
		playButton.addEventListener("click", () => togglePlay(audioPlayer))

		// Add elements to the grid
		mainGrid.appendChild(playButton)
		mainGrid.appendChild(audioPlayer)
	}
}

// Fetch and create sound elements when the page loads
fetchAndCreateSoundElements()

form.addEventListener("submit", async (e) => {
	e.preventDefault()
	const formData = new FormData(form)
	const file = formData.get("file")
	const name = formData.get("name")

	// Check if the file is an audio file
	if (file && file.type.startsWith("audio/")) {
		const fileRef = ref(db, name)

		await uploadBytes(fileRef, file)
		console.log(`File ${name} uploaded successfully`)

		// Update the sound player with the new file URL
		const downloadURL = await getDownloadURL(fileRef)
		const audioPlayer = createAudioPlayer(downloadURL, name)

		// Add play button
		const playButton = document.createElement("button")
		playButton.textContent = `${name}`
		playButton.addEventListener("click", () => togglePlay(audioPlayer))

		// Add elements to the grid
		mainGrid.appendChild(playButton)
		mainGrid.appendChild(audioPlayer)
	} else {
		console.log("Invalid file type. Please upload an audio file.")
	}
})

// Function to play or stop the sound
function togglePlay(audioPlayer) {
	if (currentlyPlayingAudio && currentlyPlayingAudio !== audioPlayer) {
		// Stop the currently playing audio
		currentlyPlayingAudio.pause()
		currentlyPlayingAudio.currentTime = 0
	}

	if (audioPlayer.paused) {
		audioPlayer.play()
		currentlyPlayingAudio = audioPlayer
	} else {
		audioPlayer.pause()
		audioPlayer.currentTime = 0
		currentlyPlayingAudio = null
	}
}

// Function to create an audio player
function createAudioPlayer(src, id) {
	const audioPlayer = document.createElement("audio")
	audioPlayer.src = src
	audioPlayer.id = `audio-player-${id}`
	audioPlayer.controls = true
	return audioPlayer
}
