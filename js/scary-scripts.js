//logic maths & computational nitty gritty

//encapsulated logic for jquery plugin (still fuzzy on how this works)
(function ($)
{
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

  // export jQuery plugin
  $.fn.minesweeper = function ()
  {
    Game(this);

    return this;
  };

}(jQuery));


//jquorey
$(function(){
  $('#minesweeper').minesweeper();
});
