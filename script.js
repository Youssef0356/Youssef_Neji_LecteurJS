//we load the json file
let tracks=[]
let index=0
fetch("tracks.json").then(res=>res.json()).then(data => {
tracks=data
loadTrack()

})

//we load the track now by grapping ids

let audio = document.getElementById('audio')
let title = document.getElementById('title')
function loadTrack(){
    audio.src = tracks[index].src
    title.textContent = tracks[index].title
}