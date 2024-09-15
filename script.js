let songIndex;
let currfolder;
let songList = []
async function getSongs(folder) { 
    currfolder = folder
    let a = await fetch(`songs/${currfolder}`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    songs = []
    songList = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }
    let d = document.querySelector(".second").getElementsByTagName("ul")[0]
    d.innerHTML = ''
    for (const s of songs) {
        let song = s.split(`/songs/${currfolder}`)[1]
        song = song.split('.mp3')[0]
        song = song.replaceAll('_', ' ')
        let html = `<li>
        <img src="image/music.svg" alt="">
        <div class="info">
            <span>${song}</span>
            <span>•Jinni</span>
        </div>
       <svg class='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
    <circle cx="12" cy="12" r="10"  stroke-width="1.5" />
    <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
<style>
    .icon{
    stroke: #fff;
    fill: none;
    color: #fff;
    }
  .icon:hover{
    stroke: none;
    fill: #3BE276;
    transform: scale(150%);
  }
</style>
</svg>

    </li>`
        d.innerHTML = d.innerHTML + html
        songList.push(song)
    }
        // Attach an event listener to play a song

    Array.from(document.querySelector(".second").getElementsByTagName("li")).forEach((e, index) => {
        e.children[2].addEventListener('click', function () {
            music = e.querySelector('.info').firstElementChild.innerHTML
            songIndex = index;   // index used for playing next and previous songs.
            playmusic(music)

        })
    })
}

let currentsong = new Audio();  //Global Scope Variable only one music runs at a time ...

const playmusic = (music) => {
    // var audio = new Audio(`/songs/${folder}`+music+'.mp3');
    song = music.replaceAll(' ', '_')   //this will not show underscore in songname in player section
    currentsong.src = (`songs/${currfolder}/` + song + '.mp3')
    currentsong.play();
    play.src = "image/pause.svg"
    document.querySelector('.songname').innerHTML = music
    document.querySelector('.songtime').innerHTML = '00:00'

}

function SecondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    minutes = String(minutes).padStart(2, '0')
    // minutes = Number(minutes)
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ":" + remainingSeconds;
}


async function albums() {
    let a = await fetch(`songs`);
    let response = await a.text();
    
    let div = document.createElement('div');
    div.innerHTML = response;

    let anchor = div.getElementsByTagName('a');
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchor);

    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        
        if (element.href.includes('/songs')) {
            let folder = element.href.split('/').slice(-2)[0];
            
            let a = await fetch(`songs/${folder}/info.json`);
            let songInfo = await a.json();
            

            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <svg class="play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
                        <rect x="0" y="0" width="32" height="32" fill="#3BE276" rx="16" ry="16"/>
                        <path d="m11.05 7.606 13.49 7.788a.7.7 0 0 1 0 1.212L11.05 24.394A.7.7 0 0 1 10 23.788V8.212a.7.7 0 0 1 1.05-.606z" fill="black"></path>
                    </svg>
                    <img src="songs/${folder}/cover.jpeg" alt="image">
                    <p>${songInfo.title}</p>
                </div>`;
        }
    }

    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async (item) => {
            let folder = item.currentTarget.dataset.folder;
            let songs = await getSongs(folder);
            playmusic(songList[0])
            console.log(songList) // Fetch songs for the clicked folder
        });
    });
}




// let ran = Math.floor(Math.random()*10)
// console.log(ran)
async function playlist() {
    await getSongs('folder1')

    
    await albums()
    // playmusic(songList[ran])          //play a random song when pressed play 

    // Attach an event listener to play pause song
    play.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = 'image/pause.svg'
        }
        else {
            currentsong.pause();
            play.src = 'image/playerPlay.svg'
        }
    })

    // Play next song
    next.addEventListener('click', () => {
            playmusic(songList[songIndex++])
        })
        
        //Play previous song
        prev.addEventListener('click', () => {
            playmusic(songList[songIndex--])
    })

    //Attach an event litener to mute and unmute song
    unmute.addEventListener('click', () => {
        if (currentsong.muted) {
            currentsong.muted = false;
            unmute.src = 'image/unmute.svg'
        } else {
            currentsong.muted = true;
            unmute.src = 'image/mute.svg'
        }
    })

    //Attach event listener for apperence of colume range on hover volume button

    document.querySelector('.vol_set').addEventListener('mouseover', () => {
        vol_seek.style.opacity = '1'
    })
    document.querySelector('.vol_set').addEventListener('mouseout', () => {
        vol_seek.style.opacity = '0'
    })

    //Attach event listener for adjusting the volume with range
    vol_seek.addEventListener('input', () => {
        currentsong.volume = vol_seek.value/100
        console.log("volume set to",currentsong.volume)
    })

    // Attach an event listener for timeupdate of song
    currentsong.addEventListener('timeupdate', () => {
        document.querySelector('.songtime').innerHTML = SecondsToMinutes(currentsong.currentTime);
        document.querySelector('.circle').style.left = (currentsong.currentTime / currentsong.duration) * 100 + '%'

    })
    //Attach event listener to seekbar to update seekbar  
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%'
        currentsong.currentTime = (currentsong.duration * percent) / 100
    })


    // Attach an event listener to show player only when we play a song
    let player = document.querySelector('.player')
    player.style.opacity = '0'
    currentsong.addEventListener('play',()=>{
        player.style.opacity = '1'
        })

    // Attach an event listener for opening side menu
    document.querySelector(".arrow_right").addEventListener('click', () => {
        document.querySelector('.left').style.left = "-1%"
        document.querySelector(".arrow_right").style.opacity = 0
    })
    // Attach an event listener for closing side menu
    document.querySelector(".arrow_left").addEventListener('click', () => {
        document.querySelector('.left').style.left = "-100%"
        document.querySelector(".arrow_right").style.opacity = 1
    })




}
playlist()



