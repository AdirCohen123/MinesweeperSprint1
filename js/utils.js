'use strict'

function renderBoard(board) {
    var elBoard = document.querySelector('.board-container');
    var strHTML = '<table id="boardTable">\n';
    var elFlagsNum = document.querySelector('.flags-number');
    elFlagsNum.innerText = gCurrLevel.mines;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board.length; j++) {
            var cellColor = (i + j) % 2 === 0 ? 'white' : 'dark'
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this, ${i}, ${j})" class="${className} ${cellColor}"></td>`
        }
        strHTML += '</tr>';
    }
    strHTML += '</table>';
    elBoard.innerHTML = strHTML;

}
/**
 * this function set random positions to the mines
 * @param {*} board current board
 * @param {*} notMinePos to start new game without pick in the firs click on mine
 * @returns 
 */
function setMines(board, notMinePos) {
    gGame.mines = [];
    var numOfMinesPlaced = 0;
    while (numOfMinesPlaced !== gCurrLevel.mines) {
        var randomI = getRandomInteger(0, board.length - 1);
        var randomJ = getRandomInteger(0, board.length - 1);
        if (randomI === notMinePos.i && randomJ === notMinePos.j) continue;
        if (board[randomI][randomJ].type === EMPTY) {
            addMine(board, randomI, randomJ);
            numOfMinesPlaced++;
        }
    }
    return board;
}

/**
 * this function create new mine
 * @param {*} board current board
 * @param {*} i 
 * @param {*} j 
 */
function addMine(board, i, j) {
    var cell = {
        type: MINE,
        minesAroundCount: 0,
        isShown: false,
        isMine: true,
        isMarked: false,
        isCanClick: true
    }
    board[i][j] = cell;
    gGame.mines.push({ i, j });
}



function updateTimer() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = elTimer.innerText === "" ? 0 : parseInt(elTimer.innerText) + 1;
}


/**
 * this function check if the position that we got in valid place
 * @param {*} board the current board
 * @param {*} pos the position that we check
 * @returns 
 */
function checkInBound(board, pos) {
    return (pos.i >= 0 && pos.i < board.length &&
        pos.j >= 0 && pos.j < board.length);
}

/**
 * this function render the buttons of the levels
 */
function renderLevelButton() {
    var elLevel = document.querySelector('.levels-buttons');
    var strHTML = '';
    for (var levelIdx in gLevels) {
        strHTML += `<button onclick="selectLevel(${levelIdx})"class="level">${gLevels[levelIdx].levelName}</button>`
    }
    elLevel.innerHTML = strHTML;
}


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}