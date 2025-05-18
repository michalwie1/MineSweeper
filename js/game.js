const EMPTY = 'null'
const BOMB = '💣'
const ONE = 1
const TWO = 2
const THREE = 3

const gBoard = {
  minesAroundCount: 4,
  isRevealed: false,
  isMine: false,
  isMarked: false,
}

const gCurrPos = 9

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
  gGame.isOn = true
  const board = buildBoard()
  console.table(board)
  checkMinesNegs(board)
  renderBoard(board)
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

  var count = 0
  //SHOULD VERIFY IT"S NOT THE SAME LOCATION!!!!!
  while (count < gLevel.MINES) {
    console.log('count', count)
    // console.log('count',count )

    var randRow = getRandomInt(0, size - 1)
    var randCol = getRandomInt(0, size - 1)
    console.log(randRow, randCol)

    board[randRow][randCol].isMine = true
    count++
  }
  return board
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
        console.log(row, col, board[i][j].isMine)
        minesCount++
      }
    }
  }
  board[row][col].minesAroundCount = minesCount
  console.log('hi', minesCount)
}

function onCellClicked(elCell, i, j) {
  //   console.log('hi')
}

function onCellMarked(elCell, i, j) {}
function checkGameOver() {}
function expandReveal(board, elCell, i, j) {}
