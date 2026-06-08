let tracks = []
let index  = 0

let audio    = document.getElementById('audio')
let title    = document.getElementById('title')
let progress = document.getElementById('progress')

fetch('/api/songs')
    .then(res => res.json())
    .then(data => {
        tracks = data
        showPlaylist()
        if (tracks.length > 0) loadTrack()
    })

function loadTrack() {
    audio.src          = tracks[index].url
    title.textContent  = tracks[index].title
    showPlaylist()
}

function showPlaylist() {
    const list = document.getElementById('playlist')

    list.innerHTML = tracks.map((track, i) => `
        <li class="${i === index ? 'active' : ''}">
            <span onclick="playAt(${i})">${track.title}</span>
            <button class="delete-btn" onclick="deleteSong(${i})">✕</button>
        </li>
    `).join('')
}

function playAt(i) {
    index = i
    loadTrack()
    audio.play()
}

function deleteSong(i) {
    const formData = new FormData()
    formData.append('id', tracks[i].id)

    fetch('/api/songs/delete', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                tracks.splice(i, 1)
                if (index >= tracks.length) index = 0
                if (tracks.length > 0) loadTrack()
                else {
                    audio.src             = ''
                    title.textContent     = 'No song selected'
                    showPlaylist()
                }
            }
        })
}

// Play / Pause
document.getElementById('play').onclick = () => {
    if (audio.paused && tracks.length > 0) audio.play()
    else audio.pause()
}

// Next
document.getElementById('next').onclick = () => {
    if (tracks.length === 0) return
    index = (index + 1) % tracks.length
    loadTrack()
    audio.play()
}

// Previous
document.getElementById('prev').onclick = () => {
    if (tracks.length === 0) return
    index = (index - 1 + tracks.length) % tracks.length
    loadTrack()
    audio.play()
}

// Progress bar — audio updates the slider
audio.ontimeupdate = () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100
    }
}

// Progress bar — user drags the slider
progress.oninput = (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration
}

// Volume
document.getElementById('volume').oninput = (e) => {
    audio.volume = e.target.value
}

// Visual feedback when playing
audio.onplay  = () => title.classList.add('playing')
audio.onpause = () => title.classList.remove('playing')

// Upload a song
document.getElementById('uploadBtn').onclick = () => {
    const fileInput = document.getElementById('fileInput')
    const status    = document.getElementById('uploadStatus')

    if (fileInput.files.length === 0) {
        status.textContent = 'Please select a file.'
        return
    }

    const formData = new FormData()
    formData.append('file', fileInput.files[0])
    status.textContent = 'Uploading...'

    fetch('/api/songs/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                status.textContent = 'Error: ' + data.error
            } else {
                status.textContent = 'Song added!'
                tracks.push({ id: data.id, title: data.title, url: data.url })
                index = tracks.length - 1
                loadTrack()
                audio.play()
                fileInput.value = ''
            }
        })
        .catch(() => {
            status.textContent = 'Network error.'
        })
}
