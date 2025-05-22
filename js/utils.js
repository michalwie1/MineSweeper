

function renderBoard(board, cellPosStarted) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {

      var cellMinesAround =
        board[i][j].minesAroundCount === 0
          ? EMPTY
          : board[i][j].minesAroundCount 

      var cellObj = board[i][j].isMine ? BOMB : cellMinesAround
      const className = `cell-${i}-${j}`
      const imgState = (cellPosStarted && cellPosStarted.i == i && cellPosStarted.j == j) ? 'revealed' : 'hidden'

        strHTML += `<td onmousedown="onCellClick(event,this)" class="${className}">${cellObj}  
        <img class="${imgState}" src="img/grey-cover.jpg">
        <p class="flag">&#x2691</p>
        </td>`
    }
    strHTML += '</tr>'
  }

  const elBoard = document.querySelector('.board')

  console.log(elBoard)
  elBoard.innerHTML = strHTML
}

function renderEmptyBoard(board) {
  //   console.log(cellObj)
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      var cellObj = EMPTY
      const className = `cell-${i}-${j}`

      strHTML += `<td onmousedown="onCellClick(event,this)" class="${className}">${cellObj}  
      <img class="hidden" src="img/grey-cover.jpg">
      <p class="flag">&#x2691</p>
      </td>`
    }
    strHTML += '</tr>'
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function startTimer() {
  gStartTime = Date.now()
  gTimerInterval = setInterval(updateTimer, 25)
}

function updateTimer() {
  const now = Date.now()
  const diff = (now - gStartTime) / 1000
  //update to the DOM
  document.querySelector('.timer').innerText = diff.toFixed(3)
  
  gGame.secsPassed = diff
}

function stopTimer() {
  clearInterval(gTimerInterval)
}

function onChangeLevel(elBtn) {
  if (elBtn.innerText === 'Beginner') {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()
  }
  if (elBtn.innerText === 'Medium') {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    onInit()
  }
  if (elBtn.innerText === 'Expert') {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    onInit()
  }
}

function returnCellPos(cellClass) {
  //cell-0-0
  var classArr = cellClass.split('-')
  return (cellPos = { i: classArr[1], j: classArr[2] })
}

function getRandomInt(min, max) {
  var random = Math.random()
  return Math.floor(random * (max - min) + min)
}
