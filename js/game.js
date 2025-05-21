const EMPTY = '-'
const BOMB = '💣'
const SMILEY = '😀'
const SAD = '☹️'
const SURPRISED = '😮'
const WIN = '😎'

var gBoard

var gLives
var gTimerInterval
var gStartTime

gLevel = {
  SIZE: 4,
  MINES: 2,
}

gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit() {
  gGame.revealedCount = 0
  gLives = 3
  gGame.isOn = true
  gBoard = buildBoard()
  console.table(gBoard)
  //   onFirstClick(gBoard)
  //   checkMinesNegs(gBoard)
  renderEmptyBoard(gBoard)
  //   renderBoard(gBoard)
  //   setMinesNegsCount(board, 2, 2)
  //   startTimer() // TURN ON!!!
}

function buildBoard() {
  const size = gLevel.SIZE
  const board = []

  for (var i = 0; i < size; i++) {
    board.push([])

    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  //   addRandomMines(board)

  return board
}

function onFirstClick(board) {
  addRandomMines(board)
  checkMinesNegs(board)
  renderBoard(board)
}

function addRandomMines(board) {
  const size = gLevel.SIZE
  var count = 0

  while (count < gLevel.MINES) {
    var randRow = getRandomInt(0, size - 1)
    var randCol = getRandomInt(0, size - 1)

    if (board[randRow][randCol].isMine) continue
    board[randRow][randCol].isMine = true

    count++
  }
}

function checkMinesNegs(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      setMinesNegsCount(board, i, j)
    }
  }
}
function setMinesNegsCount(board, row, col) {
  var minesCount = 0

  //negs loop:
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === row && j === col) continue
      if (board[i][j].isMine) {
        // console.log(row, col, board[i][j].isMine)
        minesCount++
      }
    }
  }
  board[row][col].minesAroundCount = minesCount
  //   console.log('minesCount', minesCount)
}

function onCellClick(event, elCell) {
  const elFlag = elCell.querySelector('.flag')

  if (elCell.querySelector('.revealed')) {
    console.log('can only be clicked once')
  }

  if (event.button === 0) {
    console.log('Left click!')
    onLeftClick(elCell)
  } else if (event.button === 2) {
    console.log('Right click!')
    onCellMarked(event, elCell)
    if (elFlag.style.display === 'block') {
      elFlag.style.display = 'none'
    } else {
      elFlag.style.display = 'block'
      gGame.markedCount++
    }
  }
}

function onLeftClick(elCell) {
  //SHOULD CHECK WHY FIRST CLICK IS DOING PROBLEM
  const cellPos = returnCellPos(elCell.className)

  //bomb click - game over
  if (!gGame.isOn) return
  if (elCell.querySelector('.revealed')) {
    console.log('can only be clicked once')
  } else {
    //update MODEL
    gGame.revealedCount++
    gBoard[cellPos.i][cellPos.j].isRevealed = true

    //remove flag
    const elFlag = elCell.querySelector('.flag')
    elFlag.style.display = 'none'

    //reveal cell
    const cellHidden = elCell.querySelector('.hidden')
    cellHidden.classList.add('revealed')

    //surprised while clicking
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = SURPRISED
    // return smiley emoji
    setTimeout(() => {
      elSmiley.innerText = SMILEY
    }, 150)

    //first click - no mine
    if (gGame.revealedCount === 1) {
      console.log('first click!')
      onFirstClick(gBoard)
    }
    if (elCell.innerText === BOMB) {
      checkGameOver()
      //   console.log('its a bomb!!!')
      //   gLives--
    }
    if (elCell.innerText === EMPTY) {
      expandReveal(elCell)
    }
  }
}

function onSmileyClicked(elSmiley) {
  if (elSmiley.innerText === SMILEY) {
  }
  if (elSmiley.innerText === SAD) {
    console.log('should do restart')
  }
  //   if (elSmiley.innerText === SURPRISED) {
  //   }
}

function checkGameOver() {
  //if game over: (stepped on a mine and have no life left)
  stopTimer()
  gGame.isOn = false
  const elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = SAD
  console.log(elSmiley.innerText) //CHECK

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      //GAME OVER:
      if (gBoard[i][j].isMine) {
        const cellImg = document.querySelector(`.cell-${i}-${j} img`)
        cellImg.classList.add('revealed')
      }

      //WIN: - should check!!!!
      const cellHidden = document.querySelector(`.cell-${i}-${j}`)
      console.log('test', cellHidden)
      const elFlag = document.querySelector('.flag')

      if (cellHidden.innerText === BOMB && elFlag.style.display === 'block') {
        // console.log('you won!!!')
      }
    }
  }

  //if wins: All the mines are flagged, and all the other cells are revealed (User's victory)

  //     <td onmousedown="onCellClick(event,this)" class="cell-0-3">-
  //   <img class="hidden" src="img/grey-cover.jpg">
  //   <p class="flag" style="display: block;">⚑</p>
  //   </td>
  //   elSmiley.innerText = WIN
}

function expandReveal(elCell) {
  console.log('trying to reveal2')
  const currPos = returnCellPos(elCell.className)

  const row = currPos.i
  const col = currPos.j
  //negs loop:
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (i === row && j === col) continue

      //reveal negs empty cells:
      const cellHidden = document.querySelector(`.cell-${i}-${j}`)
      const cellImg = document.querySelector(`.cell-${i}-${j} img`)
      if (cellHidden.innerText === EMPTY) {
        cellImg.classList.add('revealed')
      }
    }
  }
}

function onCellMarked(event, elCell) {
  elCell.addEventListener('contextmenu', function (event) {
    event.preventDefault()
  })
}

//SHOULD ADD: IF A MINE CLICKED && NO LIFE >> ALL MINES REVEALED

//SHOULD ADD: second degree neighbors
