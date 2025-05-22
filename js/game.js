

const EMPTY = ''
const BOMB = '💣'
const HAPPY = '😀'
const SAD = '☹️'
const SURPRISED = '😮'
const WIN = '😎'

var gBoard
// var gLives
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
  renderEmptyBoard(gBoard)
  startTimer() // TURN ON!!!

  const elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = HAPPY
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

function onFirstClick(board, cellPos) {
  addRandomMines(board, cellPos)
  checkMinesNebs(board)
  renderBoard(board,  cellPos)
}

function addRandomMines(board, cellPos) {
  const size = gLevel.SIZE
console.log(`cellPos.i: ${cellPos.i}, cellPos.j: ${cellPos.j}`)
  var count = 0

  while (count < gLevel.MINES) {
    var randRow = getRandomInt(0, size - 1).toString()
    var randCol = getRandomInt(0, size - 1).toString()

    if ((randRow !== cellPos.i || randCol !== cellPos.j) && !board[randRow][randCol].isMine) {
  board[randRow][randCol].isMine = true

  count++
  console.log('bombPos:', randRow, randCol)
}

  }
}

function checkMinesNebs(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      setMinesNebsCount(board, i, j)
    }
  }
}
function setMinesNebsCount(board, row, col) {
  var minesCount = 0

  //nebs loop:
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === row && j === col) continue
      if (board[i][j].isMine) {
        minesCount++
      }
    }
  }
  board[row][col].minesAroundCount = minesCount
}

function onCellClick(event, elCell) {
  const elFlag = elCell.querySelector('.flag')

  if (elCell.querySelector('.revealed')) return

  if (event.button === 0) {
    console.log('Left click!')
    onLeftClick(elCell)
  } else if (event.button === 2) {
    console.log('Right click!')
    onCellMarked(event, elCell)

    if (gGame.revealedCount !== 0) {
      if (elFlag.style.display === 'block') {
        elFlag.style.display = 'none'
      } else {
        elFlag.style.display = 'block'
        gGame.markedCount++
      }
    }
  }

  if (gGame.markedCount === gLevel.MINES) {
    checkVictory()
  }
}

function onLeftClick(elCell) {
  const cellPos = returnCellPos(elCell.className)

  if (!gGame.isOn) return

  //update MODEL
  gGame.revealedCount++

  //first click - no mine
  if (gGame.revealedCount === 1) {
    console.log('first click!')
    onFirstClick(gBoard, cellPos)
  }

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

  //BOMB: game over + restart
  if (elCell.innerText === BOMB) {
    elSmiley.innerText = SAD
    checkGameOver()
    //   gLives--
  }

  // return happy emoji after surprised
  if (elSmiley.innerText === SURPRISED) {
    setTimeout(() => {
      elSmiley.innerText = HAPPY
    }, 150)
  }

  //expand all no-mines nebs cells
  if (elCell.innerText === EMPTY) {
    expandReveal(elCell)
  }
}

function onSmileyClicked(elSmiley) {
  if (elSmiley.innerText === HAPPY) {
  }
  //restart
  if (elSmiley.innerText === SAD) {
    onInit()
  }
}

function checkGameOver() {
  //if game over: (stepped on a mine and have no life left)
 var isGameOver = false
 const elSmiley = document.querySelector('.smiley')
  
 gGame.isOn = false
  elSmiley.innerText = SAD


  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      //GAME OVER:
      if (gBoard[i][j].isMine) {
        //remove flags:
        const elFlag = document.querySelector(`.cell-${i}-${j} p`)
        if (elFlag.style.display === 'block') {
          elFlag.style.display = 'none'
        }
        //expand mines:
        const cellImg = document.querySelector(`.cell-${i}-${j} img`)
        cellImg.classList.add('revealed')
        isGameOver = true
            }
  }
  }

  if (isGameOver){
        console.log('GAME OVER')
        stopTimer()
        gGame.isOn = false
        const elSmiley = document.querySelector('.smiley')
        elSmiley.innerText = SAD
  }
}

function checkVictory() {
  var existsHiddenCells = false

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].isRevealed && !gBoard[i][j].isMine) {
        existsHiddenCells = true
      }
    }
  }

  isVictory = gGame.markedCount === gLevel.MINES && !existsHiddenCells

  if (isVictory) {
     gGame.isOn = false
    console.log('you won!!!')
    stopTimer()
  }
}

function expandReveal(elCell) {
  const currPos = returnCellPos(elCell.className)

  const row = currPos.i
  const col = currPos.j
  
  console.log(row, col)
  
  //nebs loop:
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue
      if (i === row && j === col) continue

      const neighborCell = gBoard[i][j]
      const elNeighbor = document.querySelector(`.cell-${i}-${j}`)
      const elImg = elNeighbor.querySelector('img')
      const elFlag = elNeighbor.querySelector('p')


      if (!neighborCell.isRevealed && !neighborCell.isMine) {
        neighborCell.isRevealed = true
        elImg.classList.remove('hidden')
        elImg.classList.add('revealed')

        if (elFlag.style.display === 'block') {
          elFlag.style.display = 'none'
        }
      }
    }
  }

  if (gGame.markedCount === gLevel.MINES) {
    checkVictory()
  }
}

function onCellMarked(event, elCell) {
  elCell.addEventListener('contextmenu', function (event) {
    event.preventDefault()
  })
}

