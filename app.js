const gameBoardTable = document.getElementById('gameboard');

const boardSize = 40

let gameBoard = [...Array(boardSize).keys()].map(() => [...Array(boardSize).keys()].map(() => 0));

const snakeY = parseInt(boardSize / 2);
const snakeX = parseInt(boardSize / 2);

gameBoard[snakeY][snakeX] = 's';
let snake = [snakeY + '_' + snakeX];

let direction = 'u';

let foodY, foodX, foodEmojiIndex;

let score = 0;

let foodArray = ['🍎'];

let intervalID = setInterval(playGame, 100);

document.addEventListener ('keydown', e => {
    switch ( e.key ) {
        case 'ArrowUp':
            direction = 'u';
            break;
        case 'ArrowDown':
            direction = 'd';
            break;
        case 'ArrowLeft':
            direction = 'l';
            break;
        case 'ArrowRight':
            direction = 'r';
            break;
    }
});

addFood();

// game engine
function playGame () {
    let [cursorY, cursorX] = calculateNewCursor();
    
    if ( ifHitsBorder(cursorY, cursorX) || ifHitsSelf(cursorY, cursorX) ) {
        return 0;
    }

    ifEatsFood(cursorY, cursorX); // Ensure this function is called

    snake.unshift(cursorY + '_' + cursorX);
    snake.pop();

    drawGameBoard();
}

function ifHitsSelf ( y, x ) {
    const newSnakePosition = y + '_' + x;
    if (snake.includes(newSnakePosition)) {
        clearInterval(intervalID);
        intervalID = null;
        document.getElementById('gameOverScreen').style.display = 'block';
        return true;
    }
    return false;
}


// for drawing game board
function drawGameBoard () {

    gameBoardTable.innerHTML = '';
    
    gameBoard.forEach( (row, y) => {
        const boardRowTr = document.createElement('tr');
        row.forEach( (cell, x) => {
            const boardCellTd = document.createElement('td');
            const id = y + '_' + x;
            boardCellTd.setAttribute('id', id);
            if ( snake.includes(id) ) {
                boardCellTd.classList.add('snake');
            }
            if ( y == foodY && x == foodX ) {
                boardCellTd.innerHTML = foodArray[foodEmojiIndex];
            }
            boardRowTr.append(boardCellTd);
        });
        gameBoardTable.append(boardRowTr);
    });
}


// calculate new cursor for snake
function calculateNewCursor () {

    let [y, x] = snake[0].split('_');

    switch ( direction ) {
        case 'u':
            y--;
            break;
        case 'd':
            y++;
            break;
        case 'l':
            x--;
            break;
        case 'r':
            x++;
            break;
    }

    if ( y == foodY && x == foodX ) {
        addFood();
    }

    return [y, x];    
}

// test if snake hits the border
function ifHitsBorder ( y, x ) {

    if ( y < 0 || y >= boardSize || x < 0 || x >= boardSize ) {
        clearInterval(intervalID);
        intervalID = null;
        document.getElementById('gameOverScreen').style.display = 'block';
        return true;
    }

    return false;
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highscore').innerText = 'High Score: ' + highScore;

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highscore').innerText = 'High Score: ' + highScore;
    }
}

function ifEatsFood(y, x) {
    if ( y == foodY && x == foodX ) {
        score++;
        updateScore();
        updateHighScore();
        addFood();
        return true;
    }
    return false;
}

function addFood () {
    // remove food from old location
    if (foodY !== undefined && foodX !== undefined) {
        const oldFoodTd = document.getElementById(foodY + '_' + foodX);
        oldFoodTd.innerHTML = '';
    }

    do {
        foodY = Math.floor(Math.random() * boardSize);
        foodX = Math.floor(Math.random() * boardSize);
    } while ( snake.includes(foodY + '_' + foodX) )

    const foodTd = document.getElementById(foodY + '_' + foodX);
    foodEmojiIndex = 0; // set foodEmojiIndex to 0
    foodTd.innerHTML = foodArray[foodEmojiIndex];

    snake.push(snake[snake.length - 1]);
}

    // const foodTd = document.getElementById(y + '_' + x);
    // console.log(y + '_' + x, foodTd);
    // foodTd.classList.add('food');