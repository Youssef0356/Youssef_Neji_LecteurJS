//we load the json file
let tracks = []
let index = 0
fetch("tracks.json").then(res => res.json()).then(data => {
    tracks = data
    loadTrack()

})

//we load the track now by grapping ids and use the ready functions that js provided
let audio = document.getElementById('audio')
let title = document.getElementById('title')
let progress = document.getElementById('progress')

// loading data to current state
function loadTrack() {
    audio.src = tracks[index].src
    title.textContent = tracks[index].title
}

// managing Play/Pause
document.getElementById('play').onclick = () => {
    if (audio.paused) audio.play()
    else audio.pause()
}

// next track and previous track
document.getElementById('next').onclick = () => {
    index = (index + 1) % tracks.length
    loadTrack()
    audio.play()
}
document.getElementById('prev').onclick = () => {
    index = (index - 1 + tracks.length) % tracks.length
    loadTrack()
    audio.play()
}

// updating the progressbar 
audio.ontimeupdate = () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100
    }
}

// moving in the track
progress.oninput = (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration
}

// volume control
document.getElementById("volume").oninput = (e) => {
    audio.volume = e.target.value
}

// visual feedback when the music is playing
audio.onplay = () => title.classList.add('playing')
audio.onpause = () => title.classList.remove('playing')
