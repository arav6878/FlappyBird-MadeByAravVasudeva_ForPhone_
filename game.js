const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = '/assets/flappy_dunk.png';
flappyImg.addEventListener('load', startGame); // Wait for the image to load

const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 139;

let birdX = 50;
let birdY = 50;
let birdVelocity = 3;
let birdAcceleration = 2;

let pipeX = 400;
let pipeY = canvas.height - 200;

let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

canvas.addEventListener('mousedown', jump);
canvas.addEventListener('touchstart', jump);

document.getElementById('restart-button').addEventListener('click', function () {
    hideEndMenu();
    resetGame();
    loop(performance.now());
});

function increaseScore() {
    if (
        birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP ||
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored
    ) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    };

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    };

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    };

    if (
        birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y
    ) {
        return true;
    }

    if (
        birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y
    ) {
        return true;
    }

    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.3;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function jump() {
    birdVelocity = FLAP_SPEED;
}

function loop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(flappyImg, birdX, birdY);

    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -50, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    if (collisionCheck()) {
        endGame();
        return;
    }

    const deltaTime = timestamp - loop.previousTimestamp || 0;
    loop.previousTimestamp = timestamp;

    pipeX -= 1.5 * (deltaTime / 16); // Adjust the speed based on deltaTime

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    birdVelocity += birdAcceleration * (deltaTime / 16); // Adjust the acceleration based on deltaTime
    birdY += birdVelocity * (deltaTime / 16); // Adjust the velocity based on deltaTime

    increaseScore();
    requestAnimationFrame(loop);
}

function startGame() {
    loop(performance.now());
}

const canvas1 = document.querySelector('canvas');
canvas1.addEventListener('touchstart', jump);
