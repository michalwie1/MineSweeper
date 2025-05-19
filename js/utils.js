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
          : board[i][j].minesAroundCount
      //   console.log('cellMinesAround', cellMinesAround)
      var cellObj = board[i][j].isMine ? BOMB : cellMinesAround
      const className = `cell-${i}-${j}`

      strHTML += `<td onmousedown="onCellMouseClick(event,this)" class="${className}">${cellObj}  
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

      strHTML += `<td onmousedown="onCellMouseClick(event,this)" class="${className}">${cellObj}  
      <img class="hidden" src="img/grey-cover.jpg">
      <p class="flag">&#x2691</p>
      </td>`
    }
    strHTML += '</tr>'
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function getRandomInt(min, max) {
  var random = Math.random()
  return Math.floor(random * (max - min) + min)
}
