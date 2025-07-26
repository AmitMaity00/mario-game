const mario = document.getElementById("mario");
const obstacle1 = document.getElementById("obstacle");
const obstacle2 = document.getElementById("obstacle2");
const scoreDisplay = document.getElementById("score");
const gameOverContainer = document.getElementById("game-over-container");

const jumpSound = document.getElementById("jump-sound");
const gameOverSound = document.getElementById("gameover-sound");
const bgm = document.getElementById("bgm");
const toggleBtn = document.getElementById("music-toggle");

let score = 0;
let gameOver = false;
let obstacleSpeed = 2;

// BGM volume
bgm.volume = 0.3;

// Music toggle
toggleBtn.addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play();
    toggleBtn.innerText = "🔊 Music: ON";
  } else {
    bgm.pause();
    toggleBtn.innerText = "🔇 Music: OFF";
  }
});

// Obstacle speed control
function updateObstacleSpeed() {
  if (score >= 800 && score % 100 === 0 && obstacleSpeed > 0.8) {
    obstacleSpeed -= 0.1;
    obstacle1.style.animation = `moveObstacle ${obstacleSpeed}s infinite linear`;
    obstacle2.style.animation = `moveObstacle ${obstacleSpeed}s infinite linear`;
  }
}

// Obstacle random size
function randomizeObstacle(obstacle) {
  const size = 40 + Math.floor(Math.random() * 40);
  obstacle.style.width = `${size}px`;
  obstacle.style.height = `${size}px`;
}

// Score update
const scoreInterval = setInterval(() => {
  if (!gameOver) {
    score++;
    scoreDisplay.innerText = score.toString().padStart(5, '0');
    updateObstacleSpeed();

    if (score % 200 === 0) {
      randomizeObstacle(obstacle1);

      if (Math.random() > 0.5) {
        obstacle2.style.display = "block";
        randomizeObstacle(obstacle2);
      } else {
        obstacle2.style.display = "none";
      }
    }
  }
}, 100);

// Keyboard jump
document.addEventListener("keydown", function (event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && !mario.classList.contains("jump") && !gameOver) {
    mario.classList.add("jump");
    jumpSound.currentTime = 0;
    jumpSound.play();
    setTimeout(() => {
      mario.classList.remove("jump");
    }, 500);
  }
});

// Mobile tap jump
document.addEventListener("touchstart", function () {
  if (!mario.classList.contains("jump") && !gameOver) {
    mario.classList.add("jump");
    jumpSound.currentTime = 0;
    jumpSound.play();
    setTimeout(() => {
      mario.classList.remove("jump");
    }, 500);
  }
});

// Collision check
const checkCollision = setInterval(() => {
  const marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue("bottom"));
  const marioLeft = 50;
  const obstacles = [obstacle1, obstacle2];

  for (let obs of obstacles) {
    if (obs.style.display === "none") continue;

    const obsRight = parseInt(window.getComputedStyle(obs).getPropertyValue("right"));
    const obsLeft = window.innerWidth - obsRight - obs.offsetWidth;

    if (
      obsLeft < marioLeft + 80 &&
      obsLeft + obs.offsetWidth > marioLeft &&
      marioBottom <= obs.offsetHeight - 10
    ) {
      obs.style.animation = "none";
      obs.style.right = obsRight + "px";
      gameOverContainer.hidden = false;
      gameOver = true;
      gameOverSound.currentTime = 0;
      gameOverSound.play();
      // Keep bgm playing
      clearInterval(checkCollision);
    }
  }
}, 10);

// Start
obstacle1.style.animation = `moveObstacle ${obstacleSpeed}s infinite linear`;
obstacle2.style.animation = `moveObstacle ${obstacleSpeed}s infinite linear`;
obstacle2.style.display = "none";
