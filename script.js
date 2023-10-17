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
    const x = event.target.dataset.x;
    const y = event.target.dataset.y;
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
    return getColor(x, y) === moveColor;
  }

  function canMoveTo(x, y) {
    if (map[x][y] === ' ') {
      return true;
    }
    return getColor(x, y) !== moveColor;
  }

  function markMovesFrom() {
    initInfo();
    for (let x = 0; x <= 7; x++) {
      for (let y = 0; y <= 7; y++) {
        if (canMoveFrom(x, y)) {
          inf[x][y] = '1';
        }
      }
    }
  }

  function markMovesTo() {
    initInfo();
    for (let x = 0; x <= 7; x++) {
      for (let y = 0; y <= 7; y++) {
        if (canMoveTo(x, y)) {
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
