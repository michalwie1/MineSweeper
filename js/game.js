const EMPTY = '-'
const BOMB = '💣'
const SMILEY = '😀'
const SAD = '☹️'
const SURPRISED = '😮'
const WIN = '😎'

var gBoard

// Support 3 levels of the game
// o Beginner (4 * 4 with 2 MINES)
// o Medium (8 * 8 with 14 MINES)
// o Expert (12 * 12 with 32 MINES)

const gCurrPos = 9
var gLives

gLevel = {
  //should support more levels
  SIZE: 4,
  MINES: 2,
}

gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0, //should add
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

document.addEventListener('contextmenu', function (ev) {
  ev.preventDefault()
})

function onCellMouseClick(event, elCell) {
  const elFlag = elCell.querySelector('.flag')

  if (elCell.querySelector('.revealed')) {
    console.log('can only be clicked once')
  }

  if (event.button === 0) {
    console.log('Left click!')
    onLeftClick(elCell)
  } else if (event.button === 2) {
    console.log('Right click!')
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
  //CAN REMOVE I,J FROM FUNCTION?
  if (elCell.querySelector('.revealed')) {
    console.log('can only be clicked once')
  } else {
    gGame.revealedCount++
    console.log('revealedCount', gGame.revealedCount)

    const elFlag = elCell.querySelector('.flag')
    elFlag.style.display = 'none'
    // console.log(elCell)
    returnCellPos(elCell.className) //NEEDED????

    const elSmiley = document.querySelector('.smiley')
    // console.log(elSmiley)
    elSmiley.innerText = SURPRISED

    const cellHidden = elCell.querySelector('.hidden')
    cellHidden.classList.add('revealed')
    setTimeout(() => {
      elSmiley.innerText = SMILEY
    }, 150)

    if (gGame.revealedCount === 1) {
      console.log('first click!')
      onFirstClick(gBoard)
    }

    if (elCell.innerText === BOMB) {
      console.log('its a bomb!!!')
      gLives--
      console.log('gLives', gLives)
    }
  }
}

function returnCellPos(cellClass) {
  //cell-0-0
  var classArr = cellClass.split('-')
  var cellPos = { i: classArr[1], j: classArr[2] }
  console.log(cellPos)
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
  const elSmiley = document.querySelector('.smiley')

  //if game over: (stepped on a mine and have no life left)

  elSmiley.innerText = SAD

  //if wins: All the mines are flagged, and all the other cells are revealed (User's victory)
  elSmiley.innerText = WIN
}

function expandReveal(board, elCell, i, j) {}
function onCellMarked(elCell, i, j) {}

//SHOULD ADD SOMEWHERE: IF A MINE CLICKED && NO LIFE >> ALL MINES REVEALED

//SHOULD ADD SOMEWHERE:  Cell that has no mines in his neighbors – also expand to reveal it's 1st degree neighbors
