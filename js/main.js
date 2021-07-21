'use strict'

/****Globals variables****/
const MINE = '💣';
const EMPTY = '';
const FLAG = '🚩';
const WIN_FACE = '😎';
const LOSE_FACE = '🤯';
const NORMAL_FACE = '😉';
const TIMER_INTERVAL = 1000;

var gTimerInterval;
var gLevels = createLevels();
var gBoard;
var gGame;
var gCurrLevel;
var gLives;

/**
 * Main function of the game
 */
function initGame() {
    renderLevelButton()
    renderIcon(NORMAL_FACE);
    gGame = {
        isOn: true,
        isFirstClick: true,
        shownCount: 0,
        markedCount: 0,
        mines: [],
        gLives: 0

    }
    var elTimer = document.querySelector(".timer");
    elTimer.innerText = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);
}

/**
 * this function get the index from the button of the current level and active the game
 * @param {*} idx 
 */
function selectLevel(idx) {
    gCurrLevel = gLevels[idx];
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
    var beginnerLevel = createLevel('Beginner', 12, 8, 3);
    var mediumLevel = createLevel('Medium', 20, 10, 3);
    var expertLevel = createLevel('Expert', 40, 16, 3);
    return [beginnerLevel, mediumLevel, expertLevel]

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
    if (gGame.shownCount + gGame.markedCount === gCurrLevel.boardSize * gCurrLevel.boardSize) {
        endGame(true, "WIN!!!");
    }
}

function endGame(isWin, msg) {
    gGame.isOn = false;
    renderIcon(isWin ? WIN_FACE : LOSE_FACE);
    clearInterval(gTimerInterval);

    console.log("!!! END GAME: " + msg);

}


/**
 * recursive function that open all the empty cells around and the cells with number
 * @param {*} board 
 * @param {*} elCell 
 * @param {*} i 
 * @param {*} j 
 */
function expandShown(board, elCell, i, j) {
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
                if (currCell.isShown) continue;
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