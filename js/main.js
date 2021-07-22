'use strict'

/****Globals variables****/
const MINE = '💣';
const EMPTY = '';
const FLAG = '🚩';
const WIN_FACE = '😎';
const LOSE_FACE = '🤯';
const NORMAL_FACE = '😉';
const TIMER_INTERVAL = 1000;
const LIVE = '❤️';
const LIVE_TAKEN = '🤍';
const LAST_MINE_EXPLODE = '💥';
const HINT = '💡';
const SAFE_CLICK = '🧷';

var gTimerInterval;
var gLevels = createLevels();
var gBoard;
var gGame;
var gCurrLevel;
var gLives;

/**** sounds ****/
var winAudio = new Audio('./sounds/sounds_gameWin.wav');
var loseAudio = new Audio('./sounds/sounds_gameOver.wav');
var flagAudio = new Audio('./sounds/sounds_flag.wav');
var mineAudio = new Audio('./sounds/sounds_wrong.wav');
var unflagAudio = new Audio('./sounds/sounds_unflag.wav');
var clicklAudio = new Audio('./sounds/sounds_click.wav');

/**
 * Main function of the game
 */
function initGame() {
    clearInterval(gTimerInterval)
    renderLevelButton()
    resetHints();
    resetSafeClick();
    var elLive = document.querySelector('.lives')
    elLive.innerText = LIVE + LIVE + LIVE
    gGame = {
        isOn: true,
        isFirstClick: true,
        shownCount: 0,
        markedCount: 0,
        mines: [],
        gLives: 0,
        gHint: false,
        isCanClick: true

    }
    renderIcon(NORMAL_FACE);
    gBoard = buildBoard();
    renderBoard(gBoard);
    document.querySelector('.entry').style.display = 'none';
    var elTimer = document.querySelector(".timer");
    elTimer.innerText = 0;
}

/**
 * this function get the index from the button of the current level and active the game
 * @param {*} idx 
 */
function selectLevel(idx) {
    gCurrLevel = gLevels[idx];
    clearInterval(gTimerInterval);
    initGame()
}

/**
 * This function create level by this conditions
 * @param {*} levelName The name of the levels
 * @param {*} mines number of mines on the board
 * @param {*} boardSize the size og the board
 * @returns The level as an object
 */
function createLevel(levelName, mines, boardSize, numberOfLives) {
    return {
        levelName,
        mines,
        boardSize,
        numberOfLives
    }
}

/**
 * This function create the levels of the game
 * @returns an array of the levels
 */
function createLevels() {
    var beginnerLevel = createLevel('Beginner', 8, 6, 3);
    var mediumLevel = createLevel('Medium', 15, 8, 3);
    var expertLevel = createLevel('Expert', 30, 12, 3);
    var scaryLevel = createLevel('Scary', 40, 16, 3);
    return [beginnerLevel, mediumLevel, expertLevel, scaryLevel]
}

/**
 * This function create the modal board
 * @returns The created board
 */
function buildBoard() {
    var boardLength = gCurrLevel.boardSize
    var board = [];
    for (var i = 0; i < boardLength; i++) {
        board[i] = [];
        for (var j = 0; j < boardLength; j++) {
            var cell = {
                type: EMPTY,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isCanClick: true
            }
            board[i][j] = cell;
        }
    }
    console.log(board);
    return board;
}


function checkGameOver() {
    var elVictory = document.querySelector('.to-fireworks');
    if (gGame.shownCount + gGame.markedCount === gCurrLevel.boardSize ** 2) {
        winAudio.play()
        elVictory.style.display = 'block'
        endOfGame(true, "WIN!!!");
    }
}

function endOfGame(isWin, msg) {
    gGame.isOn = false;
    renderIcon(isWin ? WIN_FACE : LOSE_FACE);
    clearInterval(gTimerInterval);
    if (!isWin) loseAudio.play();
    console.log("!!! END GAME: " + msg);

}


/**
 * recursive function that open all the empty cells around and the cells with number
 * @param {*} board 
 * @param {*} elCell 
 * @param {*} i 
 * @param {*} j 
 */
function expandShown(board, i, j) {
    var pos = { i, j };
    expandOtherNegs(board, pos);

}

function expandOtherNegs(board, pos) {
    if (board[pos.i][pos.j].minesAroundCount) return;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (!checkInBound(board, { i, j })) continue;
            var currCell = board[i][j];
            if (!currCell.isMarked && !currCell.isShown && !currCell.isMine) {
                gGame.shownCount++
                    var selector = '.cell-' + i + "-" + j;
                var elCell = document.querySelector(selector);
                elCell.innerText = currCell.type;
                currCell.isShown = true;
                if (currCell.type === EMPTY) {
                    elCell.classList.add("cell-open");
                }
                expandOtherNegs(board, { i, j });
            }
        }
    }
}

function closeModal() {
    var elModal = document.querySelector('.to-fireworks')
    elModal.style.display = 'none';
}
// reset the buttons every reset
function resetHints(disabled = true) {
    var [elHint1, elHint2, elHint3] = document.querySelectorAll('.hints');
    elHint1.disabled = disabled;
    elHint1.innerText = HINT;
    elHint2.disabled = disabled;
    elHint2.innerText = HINT;
    elHint3.disabled = disabled;
    elHint3.innerText = HINT;
}

function takeHint(elHint) {
    if (!gGame.isOn || gGame.gHint) return;
    elHint.disabled = true;
    gGame.gHint = true;

}
// render the icon 
function renderIcon(icon) {
    var elIcon = document.querySelector('.icon');
    elIcon.innerText = icon;
}

// reset the buttons every reset
function resetSafeClick(disabled = true) {
    var [elSafe1, elSafe2, elSafe3] = document.querySelectorAll('.safeClick');
    elSafe1.disabled = disabled;
    elSafe1.innerText = SAFE_CLICK;
    elSafe2.disabled = disabled;
    elSafe2.innerText = SAFE_CLICK;
    elSafe3.disabled = disabled;
    elSafe3.innerText = SAFE_CLICK;
}

/**
 * this function give you safe click 
 * @param {*} elSafeClick 
 * @returns 
 */
function onSafeClick(elSafeClick) {
    if (!gGame.isOn) return;
    elSafeClick.disabled = true;

    var isClosedFound = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].type !== EMPTY && gBoard[i][j].type !== MINE && gBoard[i][j].type !== FLAG && !gBoard[i][j].isShown) {
                isClosedFound = true;
                break;
            }
        }
    }
    if (!isClosedFound) {
        return;
    }
    do {
        var i = getRandomInteger(0, gBoard.length - 1);
        var j = getRandomInteger(0, gBoard.length - 1);

    } while (gBoard[i][j].type === EMPTY || gBoard[i][j].type === MINE || gBoard[i][j].type === FLAG || gBoard[i][j].isShown);

    openCell({ i, j });
    return;
}

function openCell(pos) {
    var selector = '.cell-' + pos.i + "-" + pos.j;
    var elCell = document.querySelector(selector);
    elCell.innerText = gBoard[pos.i][pos.j].type;
    gBoard[pos.i][pos.j].isShown = true;
    gGame.shownCount++;

}