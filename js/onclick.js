'use strict'

function cellClicked(elCell, i, j) {
    var elLive = document.querySelector('.lives')
    if (!gGame.isOn || !gGame.isCanClick) return;

    if (gGame.isFirstClick) {
        gGame.isOn = true
        resetHints(false);
        resetSafeClick(false);
        setMines(gBoard, { i, j });
        setMinesNegsCount(gBoard);
        gTimerInterval = setInterval(updateTimer, TIMER_INTERVAL);
        gGame.isFirstClick = false;
    }

    if (!gBoard[i][j].isCanClick) return

    if (gBoard[i][j].isShown) return;

    if (gGame.gHint) {
        showHint({ i, j });
        gGame.gHint = false;
        return;
    }

    gGame.shownCount++;
    gBoard[i][j].isShown = true;
    elCell.innerText = gBoard[i][j].type;

    if (gBoard[i][j].type == MINE) {
        mineAudio.play();
        gGame.gLives++;
        if (gGame.gLives === 1) {
            elLive.innerText = LIVE_TAKEN + LIVE + LIVE;
        } else if (gGame.gLives === 2) {
            elLive.innerText = LIVE_TAKEN + LIVE_TAKEN + LIVE;
        } else {
            elLive.innerText = LIVE_TAKEN + LIVE_TAKEN + LIVE_TAKEN;
        }
        console.log(gGame.gLives);
        if (gGame.gLives == gCurrLevel.numberOfLives) {
            elCell.classList.add("last-mine");
            gBoard[i][j].type = LAST_MINE_EXPLODE;
            for (var k = 0; k < gGame.mines.length; k++) {
                var mine = gGame.mines[k];
                gBoard[mine.i][mine.j].isShown = true;
                var selector = '.cell-' + mine.i + "-" + mine.j;
                var elMine = document.querySelector(selector);
                elMine.innerText = gBoard[mine.i][mine.j].type;
            }
            endOfGame(false, " you lost ");
            return;
        }
    }
    clicklAudio.play()
    if (gBoard[i][j].type == EMPTY) {
        expandShown(gBoard, i, j);
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
        flagAudio.play()
        elCell.innerText = FLAG;
        gBoard[i][j].isCanClick = false;
        gGame.markedCount++;
        gBoard[i][j].isMarked = true;
    } else {
        unflagAudio.play()
        gGame.markedCount--;
        elCell.innerText = EMPTY;
        gBoard[i][j].isMarked = false;
        gBoard[i][j].isCanClick = true;
    }

    var elFlagsNum = document.querySelector('.flags-number');
    console.log(elFlagsNum.innerText);
    elFlagsNum.innerText = gCurrLevel.mines - gGame.markedCount;
}