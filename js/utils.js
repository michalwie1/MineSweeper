function renderBoard(board) {
  //   console.log(cellObj)
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      //   console.log(board[i][j].isMine)

      var cellMinesAround = board[i][j].minesAroundCount
      console.log('cellMinesAround', cellMinesAround)
      var cellObj = board[i][j].isMine ? BOMB : cellMinesAround

      //    cellObj = board[i][j] ? BOMB : EMPTY
      //   const cell = cellObj
      const className = `cell-${i}-${j}`

      strHTML += `<td class="${className}">${cellObj}</td>`
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
