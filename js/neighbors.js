'use strict'

/**
 * Count mines around each cell.
 * @param {*} board 
 * @param {*} pos 
 * @returns 
 */
function countMines(board, pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (!checkInBound(board, { i: i, j: j })) continue;
            if (i === pos.i && j === pos.j) continue;
            if (board[i][j].isMine === true) count++;
        }
    }
    return count;
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            setTypeOnCell(board, { i: i, j: j });
        }
    }
}
/**
 * this function set on every cell the correct type
 * @param {*} board 
 * @param {*} pos 
 */
function setTypeOnCell(board, pos) {
    var count = countMines(board, pos);
    gBoard[pos.i][pos.j].minesAroundCount = count;
    if (gBoard[pos.i][pos.j].type === EMPTY && gBoard[pos.i][pos.j].minesAroundCount !== 0) {
        gBoard[pos.i][pos.j].type = gBoard[pos.i][pos.j].minesAroundCount;
    }
}