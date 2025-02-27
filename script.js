// Initialize constants and variables first
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20; // Initialize tile size

let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let speed = 100; // Initial speed (in ms)

const gameOverMessage = document.getElementById('gameOverMessage');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score'); // Get the score display element

canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth;
canvas.height = 400;

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : 'green'; // head is lime, body is green
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function generateFood() {
  const x = Math.floor(Math.random() * (canvas.width / tileSize));
  const y = Math.floor(Math.random() * (canvas.height / tileSize));
  return { x, y };
}

function updateGame() {
  const head = { ...snake[0] };

  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  snake.unshift(head);

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = generateFood();
  } else {
    snake.pop(); // Remove last segment
  }

  // Check for wall or self collision
  if (
    head.x < 0 ||
    head.x >= canvas.width / tileSize ||
    head.y < 0 ||
    head.y >= canvas.height / tileSize ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  scoreDisplay.innerText = `Score: ${score}`;
}

function endGame() {
  gameOverMessage.classList.remove('hidden');
  document.getElementById('finalScore').innerText = `Final Score: ${score}`;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;
  gameOverMessage.classList.add('hidden');
  scoreDisplay.innerText = `Score: ${score}`;
  clearInterval(gameInterval); // Stop the current game interval
  gameInterval = setInterval(updateGame, speed); // Restart the game loop with the current speed
}

function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

// Mobile touch controls
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction !== 'LEFT') direction = 'RIGHT';
    if (deltaX < 0 && direction !== 'RIGHT') direction = 'LEFT';
  } else {
    if (deltaY > 0 && direction !== 'UP') direction = 'DOWN';
    if (deltaY < 0 && direction !== 'DOWN') direction = 'UP';
  }
});

document.addEventListener('keydown', changeDirection);

restartButton.addEventListener('click', resetGame);

let gameInterval = setInterval(updateGame, speed);

// Speed control buttons
document.getElementById('decreaseSpeed').addEventListener('click', () => {
  if (speed > 50) {
    speed -= 10; // Decrease speed (increase the time interval)
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
  }
});

document.getElementById('increaseSpeed').addEventListener('click', () => {
  if (speed < 200) {
    speed += 10; // Increase speed (decrease the time interval)
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
  }
});
