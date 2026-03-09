import { isDocumentReady, findIndex } from "../common.js";

let music = [];
let music_ids = [];
let index;

const play = document.getElementById("play");
const pause = document.getElementById("pause");

const fileView = document.getElementById("file-view");
const musicView = document.getElementById("music-view");

const musicTitle = document.getElementById("music-title");

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let cur_song;
let isPlayerReady = false;
let isPaused = false;
window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('playerfiles', {
        height: '600',
        width: '600',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    isPlayerReady = true;
    play.style.display = "none";
    play.addEventListener('click', () => {
        player.playVideo();
    });
    pause.addEventListener('click', () => {
        player.pauseVideo();
    });
}

function onPlayerStateChange(event) {
    const musicTitle = document.getElementById("music-title");
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    const forward = document.getElementById("forward");
    
    musicTitle.textContent = cur_song;
    if (cur_song.length > 25) {
        musicTitle.classList.add("scrolling-left");
    }
    else {
        musicTitle.classList.remove("scrolling-left")
    }

    switch (event.data) {
        case YT.PlayerState.PLAYING:
            play.style.display = "none";
            pause.style.display = "inline-block";
            break;
        case YT.PlayerState.PAUSED:
            pause.style.display = "none";
            play.style.display = "inline-block";
            document.querySelector(".scrolling-left").style.animationPlayState = "paused"
            isPaused = true;
            break;
        case YT.PlayerState.BUFFERING:
            pause.style.display = "none";
            play.style.display = "inline-block";
            if (!isPaused){
                musicTitle.textContent = "LOADING...";
                musicTitle.classList.remove("scrolling-left")
            }
            break;
        case YT.PlayerState.ENDED:
            forward.click();
            break;
        default:
            pause.style.display = "none";
            play.style.display = "inline-block";
            musicTitle.textContent = "ERROR, CANNOT PLAYBACK SONG";
            break;
    }

    if (isPaused && event.data !== YT.PlayerState.PAUSED) {
        isPaused = false;
        document.querySelector(".scrolling-left").style.animationPlayState = "running"
    }
}

function replaceMusic(name) {
    player.stopVideo()
    let videoId = music_ids[name];

    while (!isPlayerReady);
    if (videoId !== null) {
        player.loadVideoById(videoId, 0);
        musicTitle.textContent = "LOADING...";
        musicTitle.classList.remove("scrolling-left")
        cur_song = name;
        
        player.setVolume(100);
        player.setPlaybackRate(1);
        player.playVideo();
    }
}

export function hasMusic() {
    const marqueeWrapper = document.getElementById("marquee-wrapper");
    return (marqueeWrapper);
}

export function fillMusic(isAddEventListener) {
    music = [];
    music_ids = [];

    document.querySelectorAll("mock-file[data-type='audioStream']").forEach((item) => {
        let name = item.getAttribute("data-name");
        let content = item.getAttribute('data-content');
        music.push(name);
        music_ids[name] = content;

        if (isAddEventListener){
            item.addEventListener('click', () => {
                history.pushState({file: name, type: "music"}, name, "#"+name);
                replaceMusic(name, false);
                fileView.style.opacity = 0;
                fileView.style.animation = "fadein 400ms";
                setTimeout(function () {
                    musicView.style.display = "flex";
                    musicView.style.opacity = 1;
                    fileView.style.display = "none";
                }, 400)
            });
        }
    });
}

export function stateChangeMusic(eventState) {
    if (eventState) {
        const name = eventState["file"];
        replaceMusic(name, false);
        fileView.style.opacity = 0;
        fileView.style.animation = "fadein 400ms";
        setTimeout(function () {
            musicView.style.display = "flex";
            musicView.style.opacity = 1;
            fileView.style.display = "none";
        }, 400)
    }
    else {
        musicView.style.opacity = 0;
        play.style.display = "none";
        pause.style.display = "inline-block";
        player.pauseVideo();
        setTimeout(function () {
            fileView.style.display = "flex";
            fileView.style.opacity = 1;
            musicView.style.display = "none";
        }, 400)
    }
}

isDocumentReady(() => {
    const forward = document.getElementById("forward");
    const backward = document.getElementById("backward");
    const marqueeWrapper = document.getElementById("marquee-wrapper");
    
    if (backward) {
        backward.addEventListener('click', () => {
            let name = cur_song
            index = findIndex(name, music);

            if (index == 0)
                index = music.length - 1;
            else index--;
            history.replaceState({file: music[index], type: "music", transition: true}, music[index], "#"+music[index]);
            replaceMusic(music[index]);
        })
    }

    if (forward) {
        forward.addEventListener('click', () => {
            let name = cur_song
            index = findIndex(name, music);
            
            if (index == music.length - 1)
                index = 0;
            else index++;
            history.replaceState({file: music[index], type: "music", transition: true}, music[index], "#"+music[index]);
            replaceMusic(music[index]);
        })
    }

    if (marqueeWrapper) {
        marqueeWrapper.addEventListener('click', () => {
            history.back();
            musicView.style.opacity = 0;
            play.style.display = "none";
            pause.style.display = "inline-block";
            player.pauseVideo();
            setTimeout(function () {
                fileView.style.display = "flex";
                fileView.style.opacity = 1;
                musicView.style.display = "none";
            }, 400)
        });
        
        marqueeWrapper.addEventListener("mouseenter", () => { 
            if (!isPaused) {
                document.querySelector(".scrolling-left").style.animationPlayState = "paused"
            }
        });
        marqueeWrapper.addEventListener("mouseleave", () => { 
            if (!isPaused) {
                document.querySelector(".scrolling-left").style.animationPlayState = "running"
            }
        });
    }
});