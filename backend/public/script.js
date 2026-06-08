// Track data
let tracks = []
let index = 0

// Fetch songs from DB
fetch("/api/songs").then(res => res.json()).then(data => {
    tracks = data.map(song => ({
        id: song.id,
        title: song.title,
        src: song.url
    }));

    renderPlaylist()

    if (tracks.length > 0) {
        loadTrack()
    } else {
        document.getElementById('title').textContent = "No songs available";
    }
})

// DOM references
let audio = document.getElementById('audio')
let title = document.getElementById('title')
let progress = document.getElementById('progress')

// Load a track
function loadTrack() {
    if (tracks.length === 0) return;
    audio.src = tracks[index].src
    title.textContent = tracks[index].title
    highlightCurrent()
}

// Build playlist
function renderPlaylist() {
    const list = document.getElementById('playlist')
    list.innerHTML = ''
    tracks.forEach((track, i) => {
        const li = document.createElement('li')
        li.textContent = track.title
        li.dataset.index = i
        li.onclick = () => {
            index = i
            loadTrack()
            audio.play()
        }
        list.appendChild(li)
    })
    highlightCurrent()
}

// Highlight active song
function highlightCurrent() {
    document.querySelectorAll('#playlist li').forEach((li, i) => {
        li.classList.toggle('active', i === index)
    })
}

// Play / Pause
document.getElementById('play').onclick = () => {
    if (audio.paused && tracks.length > 0) audio.play()
    else audio.pause()
}

// Next / Previous
document.getElementById('next').onclick = () => {
    if (tracks.length === 0) return;
    index = (index + 1) % tracks.length
    loadTrack()
    audio.play()
}
document.getElementById('prev').onclick = () => {
    if (tracks.length === 0) return;
    index = (index - 1 + tracks.length) % tracks.length
    loadTrack()
    audio.play()
}

// Progress bar
audio.ontimeupdate = () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100
    }
}
progress.oninput = (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration
}

// Volume control
document.getElementById("volume").oninput = (e) => {
    audio.volume = e.target.value
}

// Visual feedback
audio.onplay = () => title.classList.add('playing')
audio.onpause = () => title.classList.remove('playing')

// Upload handler
document.getElementById('uploadBtn').onclick = () => {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('uploadStatus');

    if (fileInput.files.length === 0) {
        status.textContent = "Please select a file.";
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    status.textContent = "Uploading...";

    fetch('/api/songs/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            status.textContent = "Error: " + data.error;
        } else {
            status.textContent = "Song added!";
            tracks.push({
                title: data.title,
                src: data.url
            });
            index = tracks.length - 1;
            renderPlaylist();
            loadTrack();
            audio.play();
            fileInput.value = "";
        }
    })
    .catch(err => {
        status.textContent = "Network error.";
        console.error(err);
    });
}
