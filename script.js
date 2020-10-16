const canvas = document.getElementById('canvas');
const character = document.getElementById('character');
const halangan = document.getElementById('halangan');
const highscoreDisplay = document.getElementById('highscore');
const scoreDisplay = document.getElementById('score');
const button = document.getElementById('button')

let isJump = true;
let startCount = 0;
let score;
let highscore = localStorage.getItem('highscore') ? localStorage.getItem('highscore') : 0;
let speed;
let animationSpeed;
let tempSpeed;
let isPlaying;
const setMarginHalangan = 900
const animationStart = 'paused'
const setHalangan = ["halangan-1.png", "halangan-2.png", "halangan-3.png"];
const mouseClickAudio = new Audio('http://127.0.0.1:5500/emojigame/sounds/sfx_mouse_click-2.wav');
const jumpClickAudio = new Audio('http://127.0.0.1:5500/emojigame/sounds/sfx_wing.wav');
const pointAudio = new Audio('http://127.0.0.1:5500/emojigame/sounds/sfx_point.wav');
const dieAudio = new Audio('http://127.0.0.1:5500/emojigame/sounds/sfx_hit.wav');

function init(){
    isStart = true;
    score = 0;
    speed = 3;
    tempSpeed = 50;
    animationSpeed = 13;
    character.setAttribute('src', 'img/bola.png')
    halangan.style.marginLeft = setMarginHalangan + "px"
    button.innerHTML = "START";
    scoreDisplay.innerHTML = score;
    highscoreDisplay.innerHTML = highscore;
    canvas.style.animationDuration = animationSpeed + 's';
    canvas.style.animationPlayState = animationStart
}

function startGame(){
    isPlaying = true
    startCount++
    button.style.display = "none";
    if(isPlaying){
        canvas.style.animationPlayState = 'running';
    }
    var marginHalangan = parseInt(halangan.style.marginLeft)

    setInterval(() => {
        if(marginHalangan < 880){
            halangan.style.display = "block"
        }else{
            halangan.style.display = "none"
        }

        if(score == tempSpeed){
            speed++;
            tempSpeed *= 2;
            animationSpeed --;
        }

        if(marginHalangan > -20){
            marginHalangan -= speed;
            halangan.style.marginLeft = marginHalangan + "px";
            canvas.style.animationDuration = animationSpeed + 's'
        }

        if(marginHalangan <= -20){
            pointAudio.play();
            score+=10;
            marginHalangan = setMarginHalangan;
            const randomHalangan = Math.floor(Math.random() * setHalangan.length);
            halangan.setAttribute('src', 'img/'+ setHalangan[randomHalangan]);
            scoreDisplay.innerHTML = score;
        }

        crash()
    }, 15);
}

function crash(){
    let marginHalangan = parseInt(halangan.style.marginLeft)
    let charTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'))
    
    if((marginHalangan <= 100 && marginHalangan > 50) && charTop > -150){
        end()
        character.setAttribute('src', 'img/game-over.png');
        button.style.display = "block";
        canvas.style.animationPlayState = animationStart;
        button.innerHTML = "RESTART";

        if(score > highscore){
            highscore = score;
            localStorage.setItem('highscore', highscore)
        }

        highscoreDisplay.innerHTML = highscore;
        dieAudio.play()
        isStart = false
    }
}

function end(){
    for(let index = 0; index <= startCount; index++){
        clearInterval(index)
    }
}

function startJump(){
    if(isJump){
        isJump = false;
        jumpClickAudio.play()
        let charTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'))
        var interval = setInterval(()=>{
            character.style.top = charTop - 150 + "px"
            setTimeout(() => {
                character.style.top = 0 + "px"
                isJump = true;
                clearInterval(interval)
            }, 600)
        }, 1)
    }
}

document.addEventListener('keydown', (e) => {
    if(isPlaying && e.key === ' '){
        startJump()
    }
})

button.addEventListener('click', (e)=>{
    mouseClickAudio.play()
    if(isStart){
        startGame();
    }else{
        location.reload()
    }
})

document.addEventListener("DOMContentLoaded", (e) => {
    init();
});