//logic maths & computational nitty gritty


// Game object constructor
var Game = function(root, difficulty){
  this.difficulty = difficulty;
  this.root = root;
  this.board = new Gameboard(root.find('.gameboard'), DEFAULT_BOARD_SIZE, 1); //hardcoded for testing - creates a 3x3 board with 1 mine
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
  this.boardData = new Array(this.boardSize);
  //initialize 2d board data array based on boardSize
  for (var i = 0; i < this.boardSize; i++) {
    this.boardData[i] = new Array(this.boardSize);
  }
  this.drawBoard();
};

Gameboard.prototype.drawBoard = function(){
  //set the board dimension in css grid
  var boardWidthPx = this.boardSize * TILE_WIDTH_PX + 2;
  this.boardElement.css({
    'grid-template': 'repeat('+ this.boardSize +', 1fr) / repeat ('+ this.boardSize +', 1fr)',
    'width': boardWidthPx
  });
  var i, j, tileElement;
  for (i = 0; i < this.boardSize; i++) {
    // this.boardData[i] = new Array(this.boardSize);
    for (j = 0; j < this.boardSize; j++) {
      //add a visual representation of the tile to the DOM
      tileElement = $('<div class="tile"></div>').appendTo(this.boardElement);
      //add a tile object to the boardData matrix
      this.boardData[i][j]= new Tile(tileElement, i, j);
      //add a location data to the tile's DOM element (for when it's clicked)
      tileElement.data('location', {x: i, y: j});
      //add a click listener to the tile element (THIS DOES NOT WORK)
      tileElement.mousedown(function(click){
        switch (click.which) {
          case 1:
            alert('left click on tile at '+ tileElement.data('location').x +
                  ', ' + tileElement.data('location').y );
            break;
          case 2:
            //do nothing on middle mouse click
            break;
          case 3:
            alert('right click on tile at'+ tileElement.data('location'));
            break;

          default:
            alert('weird mouse alert!');
        }
      })
    }
  }//end of outer for loop (i)
  debugger
}

// var drawBoard = function(size){
//   $('.gameboard').empty();
//   var boardWidthPx = size * 30 + 2;
//   console.log(size);
//   console.log(boardWidthPx);
//   $(".gameboard").css(
//   {
//     'grid-template': 'repeat('+ size +', 1fr) / repeat('+ size +', 1fr)',
//     'width': boardWidthPx
//   });
//   for (var i = 0; i < size * size; i++) {
//     $(".gameboard").append('<div class="tile"></div>')
//   }
// }

//GLOBAL VARIABLES
var DEFAULT_BOARD_SIZE = 3;
var TILE_WIDTH_PX = 30;

//jquerey
$(function(){
  var myGame = new Game($('#minesweeper1'));
  // myGame.drawBoard();

  // $('#game-settings').submit(function(event){
  //   event.preventDefault();
  //   var size = $('#board-size').val();
  //   drawBoard(size);
  // })
});
