//we load the json file
let tracks=[]
let index=0
fetch("tracks.json").then(res=>res.json()).then(data => {
tracks=data
loadTrack()

})

//we load the track now by grapping ids and use the ready functions that js provided

let audio = document.getElementById('audio')
let title = document.getElementById('title')
function loadTrack(){
    audio.src = tracks[index].src
    title.textContent = tracks[index].title
}


document.getElementById('play').onclick = () => {
    if (audio.paused) audio.onplay()
        else audio.pause()

}
document.getElementById('next').onclick = () => {
    index = (index+1) % tracks.length
    loadTrack()
    audio.onplay()
}
document.getElementById('prev').onclick = () => {
    index = (index-1) % tracks.length
    loadTrack()
    audio.onplay()
}