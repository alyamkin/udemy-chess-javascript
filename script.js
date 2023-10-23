(function () {
  'use strict';

  let map = [];
  let inf = [];
  let moveColor = 'white';
  let moveFromX = '';
  let moveFromY = '';

  function figureToHtml(figure) {
    switch (figure) {
      case 'K':
        return '&#9812;';
      case 'k':
        return '&#9818;';
      case 'Q':
        return '&#9813;';
      case 'q':
        return '&#9819;';
      case 'R':
        return '&#9814;';
      case 'r':
        return '&#9820;';
      case 'B':
        return '&#9815;';
      case 'b':
        return '&#9821;';
      case 'N':
        return '&#9816;';
      case 'n':
        return '&#9822;';
      case 'P':
        return '&#9817;';
      case 'p':
        return '&#9823;';
      default:
        return '&nbsp';
    }
  }

  function initInfo() {
    inf = [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ];
  }

  function initMap() {
    map = [
      //y0 y1
      ['R', 'P', ' ', ' ', ' ', ' ', 'p', 'r'], //x = 0
      ['N', 'P', ' ', ' ', ' ', ' ', 'p', 'n'], //x = 1
      ['B', 'P', ' ', ' ', ' ', ' ', 'p', 'b'], //x = 2
      ['Q', 'P', ' ', ' ', ' ', ' ', 'p', 'q'], //x = 3
      ['K', 'P', ' ', ' ', ' ', ' ', 'p', 'k'], //x = 4
      ['B', 'P', ' ', ' ', ' ', ' ', 'p', 'b'], //x = 5
      ['N', 'P', ' ', ' ', ' ', ' ', 'p', 'n'], //x = 6
      ['R', 'P', ' ', ' ', ' ', ' ', 'p', 'r'], //x = 7
    ];
  }

  function isCorrectRookDelta(deltaX, deltaY) {
    return Math.abs(deltaX) + Math.abs(deltaY) === 1;
  }
  function isCorrectBishopDelta(deltaX, deltaY) {
    return Math.abs(deltaX) + Math.abs(deltaY) === 2;
  }
  function isCorrectQueenDelta(deltaX, deltaY) {
    return true;
  }

  function isCorrectLineDelta(deltaX, deltaY, figure) {
    if (isRook(figure)) {
      return isCorrectRookDelta(deltaX, deltaY);
    }
    if (isBishop(figure)) {
      return isCorrectBishopDelta(deltaX, deltaY);
    }
    if (isQueen(figure)) {
      return isCorrectQueenDelta(deltaX, deltaY);
    }
    return false;
  }

  function isCorrectLineMove(sx, sy, dx, dy, figure) {
    let deltaX = Math.sign(dx - sx);
    let deltaY = Math.sign(dy - sy);

    if (!isCorrectLineDelta(deltaX, deltaY, figure)) {
      return false;
    }

    do {
      sx += deltaX;
      sy += deltaY;

      if (sx === dx && sy === dy) {
        return true;
      }
    } while (isEmpty(sx, sy));

    return false;
  }

  function isEmpty(x, y) {
    return onMap(x, y) && map[x][y] === ' ';
  }

  function onMap(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  function isCorrectKingMove(sx, sy, dx, dy) {
    return Math.abs(sx - dx) <= 1 && Math.abs(sy - dy) <= 1;
  }

  function isCorrectQueenMove(sx, sy, dx, dy) {
    return isCorrectLineMove(sx, sy, dx, dy, 'Q');
  }

  function isCorrectBishopMove(sx, sy, dx, dy) {
    return isCorrectLineMove(sx, sy, dx, dy, 'B');
  }

  function isCorrectKnightMove(sx, sy, dx, dy) {
    return (
      (Math.abs(sy - dy) === 2 && Math.abs(sx - dx) === 1) ||
      (Math.abs(sy - dy) === 1 && Math.abs(sx - dx) === 2)
    );
  }

  function isCorrectRookMove(sx, sy, dx, dy) {
    return isCorrectLineMove(sx, sy, dx, dy, 'R');
  }

  function isCorrectPawnMove(sx, sy, dx, dy) {
    return true;
  }

  function isKing(figure) {
    return figure.toUpperCase() === 'K';
  }

  function isQueen(figure) {
    return figure.toUpperCase() === 'Q';
  }

  function isBishop(figure) {
    return figure.toUpperCase() === 'B';
  }

  function isKnight(figure) {
    return figure.toUpperCase() === 'N';
  }

  function isRook(figure) {
    return figure.toUpperCase() === 'R';
  }

  function isPawn(figure) {
    return figure.toUpperCase() === 'P';
  }

  function isCorrectMove(sx, sy, dx, dy) {
    const figure = map[sx][sy];
    if (isKing(figure)) {
      return isCorrectKingMove(sx, sy, dx, dy);
    }
    if (isQueen(figure)) {
      return isCorrectQueenMove(sx, sy, dx, dy);
    }
    if (isBishop(figure)) {
      return isCorrectBishopMove(sx, sy, dx, dy);
    }
    if (isKnight(figure)) {
      return isCorrectKnightMove(sx, sy, dx, dy);
    }
    if (isRook(figure)) {
      return isCorrectRookMove(sx, sy, dx, dy);
    }
    if (isPawn(figure)) {
      return isCorrectPawnMove(sx, sy, dx, dy);
    }
    return true;
  }

  function canMove(sx, sy, dx, dy) {
    if (!canMoveFrom(sx, sy)) {
      return false;
    }
    if (!canMoveTo(dx, dy)) {
      return false;
    }
    if (!isCorrectMove(sx, sy, dx, dy)) {
      return false;
    }
    return true;
  }

  function switchTurn() {
    moveColor = moveColor === 'white' ? 'black' : 'white';
  }

  function clickBoxFrom(x, y) {
    moveFromX = x;
    moveFromY = y;
    markMovesTo();
    showMap();
  }

  function clickBoxTo(x, y) {
    map[x][y] = map[moveFromX][moveFromY];
    map[moveFromX][moveFromY] = ' ';
    switchTurn();
    markMovesFrom();
    showMap();
  }

  function clickBox(event) {
    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);
    if (inf[x][y] === '1') {
      clickBoxFrom(x, y);
    }
    if (inf[x][y] === '2') {
      clickBoxTo(x, y);
    }
  }

  function attachListenerToBoardCells() {
    const cells = document.querySelectorAll('.board-cell');

    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', clickBox);
    }
  }

  function getColor(x, y) {
    const figure = map[x][y];
    if (figure === ' ') {
      return ' ';
    }
    return figure.toUpperCase() === figure ? 'white' : 'black';
  }

  function canMoveFrom(x, y) {
    if (!onMap(x, y)) {
      return false;
    }
    return getColor(x, y) === moveColor;
  }

  function canMoveTo(x, y) {
    if (!onMap(x, y)) {
      return false;
    }
    if (map[x][y] === ' ') {
      return true;
    }
    return getColor(x, y) !== moveColor;
  }

  function markMovesFrom() {
    initInfo();
    for (let sx = 0; sx <= 7; sx++) {
      for (let sy = 0; sy <= 7; sy++) {
        for (let dx = 0; dx <= 7; dx++) {
          for (let dy = 0; dy <= 7; dy++) {
            if (canMove(sx, sy, dx, dy)) {
              inf[sx][sy] = '1';
            }
          }
        }
      }
    }
  }

  function markMovesTo() {
    initInfo();
    for (let x = 0; x <= 7; x++) {
      for (let y = 0; y <= 7; y++) {
        if (canMove(moveFromX, moveFromY, x, y)) {
          inf[x][y] = '2';
        }
      }
    }
  }

  function showMap() {
    const board = document.querySelector('#board');
    let html = `<table border='1' cellpadding='2' cellspacing='0'>`;
    for (let y = 7; y >= 0; y--) {
      html += `<tr>`;
      html += `<td>${y}</td>`;
      for (let x = 0; x <= 7; x++) {
        let color;
        if (inf[x][y] === ' ') {
          color = (x + y) % 2 === 0 ? '#eeffee' : '#abcdef';
        } else {
          color = inf[x][y] === '1' ? '#aaffaa' : '#ffaaaa';
        }
        html += `<td
          class='board-cell'
          data-x='${x}'
          data-y='${y}'
          style='height: 50px;
          width: 50px;
          background-color: ${color};
          text-align: center;
          font-size: 40px'>
          ${figureToHtml(map[x][y])}
          </td>`;
      }
      html += `</tr>`;
    }
    html += `<tr>`;
    html += `<td>&nbsp;</td>`;
    for (let x = 0; x <= 7; x++) {
      html += `<td style='text-align: center;'>${x}</td>`;
    }
    html += `</tr>`;
    board.innerHTML = html;
    attachListenerToBoardCells();
  }

  function init() {
    initMap();
    markMovesFrom();
    showMap();
  }

  init();
})();
