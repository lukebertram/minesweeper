//logic maths & computational nitty gritty


// Game object constructor
var Game = function(root){
  this.rootElement = root;
};

// Gameboard Tile object constructor
var Tile = function(element, x, y){
  this.element = element;
  this.x = x;
  this.y = y;
};

// Gameboard object constructor
var Gameboard = function(element, boardSize, numMines){
  this.element = element;
  this.boardSize = boardSize;
  this.numMines = numMines;
};

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
var defaultBoardSize = 5;
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
