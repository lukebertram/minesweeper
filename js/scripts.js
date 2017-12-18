//logic maths & computational nitty gritty


// Game object constructor
var Game = function(root, difficulty){
  this.difficulty = difficulty;
  this.root = root;
  this.board = new Gameboard(root.find('.gameboard'), 3, 1); //hardcoded for testing - creates a 3x3 board with 1 mine
};

// Gameboard Tile object constructor
var Tile = function(element, x, y){
  this.element = element;
  this.x = x;
  this.y = y;
  this.hasMine = false;
  this.flagged = false;
  this.tileValue = 0;
};

// Gameboard object constructor
var Gameboard = function(boardElement, boardSize, numMines){
  this.boardElement = boardElement;
  this.boardSize = boardSize;
  this.numMines = numMines;
  this.boardData = [];
  this.drawBoard();
};

Gameboard.prototype.drawBoard = function(){
  var i, j, tileElement;
  for (i = 0; i < boardSize; i++) {
    boardData[i] = [];
    for (j = 0; i < boardSize; i++) {
      //add a visual representation of the tile to the DOM
      tileElement = $('<div class="tile"></div>').appendTo(boardElement);
      //add a tile object to the boardData matrix
      boardData[i][j] = new Tile(tileElement, i, j);
      //add a location data to the tile's DOM element (for when it's clicked)
      tileElement.data('location', {x: i, y: j});
    }
  }//end of outer for loop (i)
}

var drawBoard = function(size){
  $('.gameboard').empty();
  var boardWidthPx = size * 30 + 2;
  console.log(size);
  console.log(boardWidthPx);
  $(".gameboard").css(
  {
    'grid-template': 'repeat('+ size +', 1fr) / repeat('+ size +', 1fr)',
    'width': boardWidthPx
  });
  for (var i = 0; i < size * size; i++) {
    $(".gameboard").append('<div class="tile"></div>')
  }
}

//GLOBAL VARIABLES
var defaultBoardSize = 3;
var boardMatrix = [];

//jquerey
$(function(){
  drawBoard(defaultBoardSize);

  $('#game-settings').submit(function(event){
    event.preventDefault();
    var size = $('#board-size').val();
    drawBoard(size);
  })
});
