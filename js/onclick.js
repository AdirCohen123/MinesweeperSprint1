'use strict'

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;

    if (gGame.isFirstClick) {
        setMines(gBoard, { i, j });
        setMinesNegsCount(gBoard);
        gTimerInterval = setInterval(updateTimer, TIMER_INTERVAL);
        gGame.isFirstClick = false;
    }

    if (!gBoard[i][j].isCanClick) return

    if (gBoard[i][j].isShown) return;

    gGame.shownCount++;
    gBoard[i][j].isShown = true;
    elCell.innerText = gBoard[i][j].type;

    if (gBoard[i][j].type == MINE) {
        gGame.gLives++;
        console.log(gGame.gLives);
        if (gGame.gLives == gCurrLevel.numberOfLives) {
            elCell.classList.add("last-mine");
            for (var k = 0; k < gGame.mines.length; k++) {
                var mine = gGame.mines[k];
                gBoard[mine.i][mine.j].isShown = true;
                var selector = '.cell-' + mine.i + "-" + mine.j;
                var elMine = document.querySelector(selector);
                elMine.innerText = gBoard[mine.i][mine.j].type;
            }
            endGame(false, " you lost ");
            return;
        }
    }

    if (gBoard[i][j].type == EMPTY) {
        expandShown(gBoard, elCell, i, j);
        elCell.classList.add("cell-open");
    }
    console.log(gBoard);
    checkGameOver();
}


function cellMarked(elCell, i, j) {
    event.preventDefault();
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (!gBoard[i][j].isMarked) {
        elCell.innerText = FLAG;
        gBoard[i][j].isCanClick = false;
        gGame.markedCount++;
        gBoard[i][j].isMarked = true;
    } else {
        gGame.markedCount--;
        elCell.innerText = EMPTY;
        gBoard[i][j].isMarked = false;
        gBoard[i][j].isCanClick = true;
    }

    var elFlagsNum = document.querySelector('.flags-number');
    console.log(elFlagsNum.innerText);
    elFlagsNum.innerText = gCurrLevel.mines - gGame.markedCount;
}