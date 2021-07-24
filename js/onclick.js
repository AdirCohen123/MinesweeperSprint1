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
    var openCellClass = (i + j) % 2 === 0 ? 'open-cell-light' : 'open-cell-dark';
    var value = gBoard[i][j].type
    var classColor;
    if (value) {
        switch (+value % 6) {
            case 0:
                classColor = 'black-number';
                break;
            case 1:
                classColor = 'blue-number';
                break;
            case 2:
                classColor = 'red-number';
                break;
            case 3:
                classColor = 'purple-number';
                break;
            case 4:
                classColor = 'orange-number';
                break;
            case 5:
                classColor = 'pink-number';
                break;
            case 6:
                classColor = 'green-number';
                break;
            default:
                break;
        }
    }
    elCell.classList.add(`${openCellClass}`);
    elCell.classList.add(`${classColor}`);
    gBoard[i][j].isShown = true;
    elCell.innerText = gBoard[i][j].type;
    gGame.shownCount++;

    if (gBoard[i][j].type == MINE) {
        mineAudio.play();
        gGame.minesExposed++;
        gGame.gLives++;
        if (gGame.gLives === 1) {
            elLive.innerText = LIVE_TAKEN + LIVE + LIVE;
        } else
        if (gGame.gLives === 2) {
            elLive.innerText = LIVE_TAKEN + LIVE_TAKEN + LIVE;
        } else {
            elLive.innerText = LIVE_TAKEN + LIVE_TAKEN + LIVE_TAKEN;
        }
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
    elFlagsNum.innerText = gCurrLevel.mines - gGame.markedCount;
}