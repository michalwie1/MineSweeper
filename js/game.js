const EMPTY = ''
const BOMB = '💣'
const HAPPY = '😀'
const SAD = '☹️'
const SURPRISED = '😮'
const WIN = '😎'

var gBoard
var gLive
var gIsHint
var gSafe
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
  gLive = 3
   gIsHint = false
 gSafe = 3
  gGame.isOn = true
  gBoard = buildBoard()
  console.table(gBoard)
  renderEmptyBoard(gBoard)
  startTimer()

  //ensure black lamps
  const elHint = document.querySelectorAll('.hint')
  for (var i = 0; i < elHint.length; i++) {
    elHint[i].src = 'img/black-lamp.png'
  }

  const elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = HAPPY

  const elSafe = document.querySelector('.safe p')
  elSafe.innerText = `${gSafe} clicks available`

  const elLife = document.querySelector('.life')
  elLife.innerText = `${gLive} clicks available`
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
    var randRow = getRandomInt(0, size)
    var randCol = getRandomInt(0, size)

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

  if (elCell.querySelector('.revealed') && elCell.innerText !== BOMB) return

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
  cellHidden.classList.remove('hidden')
  cellHidden.classList.add('revealed')

  //surprised while clicking
  const elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = SURPRISED

  //BOMB & no life: game over + restart
if (elCell.innerText === BOMB && gLive === 0) {
   elSmiley.innerText = SAD
  checkGameOver()
}

  //BOMB: if clicked on a bomb and more life left
  else if (elCell.innerText === BOMB && gLive > 0 ) {
    elSmiley.innerText = SAD
  setTimeout(() => {
      elSmiley.innerText = HAPPY
    }, 1000)
    gLive--
    
    //unrevealed cell
        setTimeout(() => {
            if (gLive > 0) {
       cellHidden.classList.remove('revealed')
  cellHidden.classList.add('hidden')
            }
    }, 1000)

    //change the update lives in the DOM
      const elLife = document.querySelector('.life')
      if(gLive>1){
        elLife.innerText = `${gLive} LIVES LEFT`
      }  else if (gLive === 1){
        elLife.innerText = `${gLive} LIFE LEFT`
      } else if (gLive  === 0){
        elLife.innerText = `NO LIVES LEFT`
      }
        
       if (gLive === 0) {
        checkGameOver()
       }
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

  //hint
  if(gIsHint)  {
    hintExpandNebs(elCell)
  }
}

function onSmileyClicked(elSmiley) {
  if (elSmiley.innerText === HAPPY) {
    onInit()
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
        cellImg.classList.remove('hidden')
        isGameOver = true
            }
  }
  }

  if (isGameOver && gLive === 0){
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

      //expand all empty cells around?
      // if (neighborCell.minesAroundCount === 0) expandReveal(elCell)
      
    }
  }

  if (gGame.markedCount === gLevel.MINES) {
    checkVictory()
  }
}

function hintExpandNebs(elCell) {
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

       const elNeighbor = document.querySelector(`.cell-${i}-${j} img`)
       if (elNeighbor.querySelector('.revealed')) return
       elNeighbor.classList.remove('hidden')
       elNeighbor.classList.add('revealed')
      setTimeout(() => {
      console.log('now!')
       elNeighbor.classList.remove('revealed')
  elNeighbor.classList.add('hidden')
    }, 1500)

    }
  }

 gIsHint = false
}

function onHintClicked(elHint){
  elHint.src = 'img/light-lamp.png'

gIsHint = true
}


function onSafeClicked(elSafe){
  if (gSafe === 0) return
  const size = gLevel.SIZE
    const randRow = getRandomInt(0, size)
    const randCol = getRandomInt(0, size)

  const randomCell = document.querySelector(`.cell-${randRow}-${randCol} img`)

  if(randomCell.querySelector('.revealed')) return

  randomCell.classList.remove('hidden')
  randomCell.classList.add('revealed')
    setTimeout(() => {
  randomCell.classList.remove('revealed')
  randomCell.classList.add('hidden')
    }, 1500)

gSafe--
console.log(elSafe)
if (gSafe>1){
  elSafe.querySelector('p').innerText = `${gSafe} clicks available`
} else if (gSafe === 1){
  elSafe.querySelector('p').innerText = `${gSafe} click available`
} else if (gSafe === 0){
  elSafe.querySelector('p').innerText = `no clicks available`
}
}


function onCellMarked(event, elCell) {
  elCell.addEventListener('contextmenu', function (event) {
    event.preventDefault()
  })
}

// Best Score
// Keep the best score in local storage (per level) and show it on
// the page

//Expand nebs

// Dark Mode
// The user should be able to toggle between Dark-Mode and Light-Mode 

// Undo
// Add an “UNDO” button, so the user can undo (some of) his moves

// Manually positioned mines
// Create a “manually create” mode in which the user first
// positions the mines (by clicking cells) and then plays.

// MEGA HINT
// Mega-Hint works only once every game. It is used to reveal an
// area of the board for 2 seconds. Functionality description: (1)
// Click the “Mega Hint” button (2) then click the area’s top-left
// cell (3) then click bottom-right cell. The whole area will be
// revealed for 2 seconds. 

// MINE EXTERMINATOR
// Clicking the “Exterminator” button, eliminate 3 of the existing
// mines, randomly. These mines will disappear from the board.
// Re-calculation of neighbors-count is needed