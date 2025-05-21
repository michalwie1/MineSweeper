function renderBoard(board) {
  //   console.log(cellObj)
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      //   console.log(board[i][j].isMine)

      //   var cellMinesAround = board[i][j].minesAroundCount

      var cellMinesAround =
        board[i][j].minesAroundCount === 0
          ? EMPTY
          : board[i][j].minesAroundCount //LIMIT TO 3?
      //   console.log('cellMinesAround', cellMinesAround)
      var cellObj = board[i][j].isMine ? BOMB : cellMinesAround
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

function renderEmptyBoard(board) {
  //   console.log(cellObj)
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      var cellObj = '-'
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
  //   update to the object
  gGame.secsPassed = diff
}

function stopTimer() {
  clearInterval(gTimerInterval)
}

function onChangeLevel(elBtn) {
  if (elBtn.innerText === 'Beginner') {
    // console.log('Beginner')
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()
  }
  if (elBtn.innerText === 'Medium') {
    // console.log('Medium')
    gLevel.SIZE = 8
    gLevel.MINES = 14
    onInit()
  }
  if (elBtn.innerText === 'Expert') {
    // console.log('Expert')
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

// function runNegs(board, row, col) {
//   //negs loop
// }

function getRandomInt(min, max) {
  var random = Math.random()
  return Math.floor(random * (max - min) + min)
}
