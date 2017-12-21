//logic maths & computational nitty gritty

// Game object constructor
var Game = function(root, size){
  this.size = size;
  this.root = root;
  this.board = new Gameboard(root.find('.gameboard'), size, 10); //hardcoded for testing - creates a 3x3 board with 1 mine
};

// Gameboard Tile object constructor
var Tile = function(element, x, y){
  this.element = element;
  this.x = x;
  this.y = y;
  this.isRevealed = false;
  this.isMine = false;
  this.flagged = false;
  this.tileValue = 0;
  this.isEmpty = 1;
  this.recursed = false;
};

// set the Tile's 'isMine' property to either true or false
Tile.prototype.setMine = function(boolean){
  this.isMine = boolean;
}

Tile.prototype.setTileValue = function(num){
  var tileValue = num;
  this.isEmpty = !tileValue;
  this.tileValue = tileValue;
}
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
  var ctx = this;
  ctx.boardElement.empty();
  //set the board dimension in css grid
  var boardWidthPx = ctx.boardSize * TILE_WIDTH_PX + 2;
  ctx.boardElement.css({
    'width': boardWidthPx ,
    'grid-template': 'repeat('+ ctx.boardSize +', 1fr) / repeat ('+ ctx.boardSize +', 1fr)'
  });
  var i, j, tileElement;
  for (i = 0; i < ctx.boardSize; i++) {
    // ctx.boardData[i] = new Array(ctx.boardSize);
    for (j = 0; j < ctx.boardSize; j++) {
      //add a visual representation of the tile to the DOM
      tileElement = $('<div class="tile-space" style="width: '+ TILE_WIDTH_PX +'px; height: '+ TILE_WIDTH_PX + 'px;">' +
                        '<div class="tile" style="width: '+ TILE_WIDTH_PX +'px; height: '+ TILE_WIDTH_PX + 'px;">' +
                          '<div class="tile-front"></div>' +
                          '<div class="tile-back"></div>' +
                        '</div>' +
                      '</div>').appendTo(ctx.boardElement);
      //add a tile object to the boardData matrix
      ctx.boardData[i][j]= new Tile(tileElement, i, j);
      //add a location data to the tile's DOM element (for when it's clicked)
      tileElement.data('location', {x: i, y: j});
      //add a click listener to the tile element (THIS DOES NOT WORK)
      setClickListener(tileElement, ctx.boardData);
    }
  }//end of outer for loop (i)
  ctx.setMines();
  ctx.calcTileValues();
}

Gameboard.prototype.setMines = function(){
  var i, minesPlanted = 0, x, y;

  //randomly place amount of mines equal to 'numMines'
  while (minesPlanted < this.numMines) {
    x = getRandomInt(this.boardSize);
    y = getRandomInt(this.boardSize);

    if (!this.boardData[x][y].isMine){
      this.boardData[x][y].setMine(true);
      minesPlanted++;
    }
  }
}

Gameboard.prototype.calcTileValues = function(){
  //for every tile in the boardData matrix
  for (var i = 0; i < this.boardSize; i++) {
    for (var j = 0; j < this.boardSize; j++) {
      var tile = this.boardData[i][j];
      //if the tile doesn't contain a mine
      if(!tile.isMine){
        //calculate the number of adjacent tiles containing mines

        // var mines = this.getNeighborTiles(tile);
        var adjTiles = this.getNeighborTiles(tile);
        //increment mineCount for every adjacent tile that contains a mine
        var mines = 0;
        for (var k = 0; k < adjTiles.length; k++) {
          if (adjTiles[k].isMine) {
            mines++;
          }
        }

        //if the number of adjacent tiles containing mines is > 0
        if (mines > 0){
          //set the tile's tileValue attribute to the number of adjacent mines
          tile.setTileValue(mines);

        }
        //otherwise, set the tile's isEmpty attribute to 'true'
        else{
          tile.isEmpty = true;
        }
      }
    }
  }
}

//count the number of adjacent tiles that contain mines
Gameboard.prototype.getNeighborTiles = function(tile){

  var mineCount = 0;
  var adjTiles = [];

  //check north tile
  if (tile.y > 0) {
    adjTiles.push(this.boardData[tile.x][tile.y-1]);
  }
  //check northeast tile
  if (tile.x < this.boardSize -1 && tile.y > 0){
    adjTiles.push(this.boardData[tile.x + 1][tile.y - 1]);
  }
  //check east tile
  if (tile.x < this.boardSize -1) {
    adjTiles.push(this.boardData[tile.x + 1][tile.y]);
  }
  //check southeast tile
  if (tile.x < this.boardSize -1 && tile.y < this.boardSize -1) {
    adjTiles.push(this.boardData[tile.x + 1][tile.y + 1]);
  }
  //check south tile
  if (tile.y < this.boardSize -1) {
    adjTiles.push(this.boardData[tile.x][tile.y + 1]);
  }
  //check southwest tile
  if (tile.x > 0 && tile.y < this.boardSize -1) {
    adjTiles.push(this.boardData[tile.x - 1][tile.y + 1]);
  }
  //check west tile
  if (tile.x > 0) {
    adjTiles.push(this.boardData[tile.x - 1][tile.y]);
  }
  //check northwest tile
  if (tile.x > 0 && tile.y > 0) {
    adjTiles.push(this.boardData[tile.x - 1][tile.y - 1]);
  }

  //increment mineCount for every adjacent tile that contains a mine
  // for (var i = 0; i < adjTiles.length; i++) {
  //   if (adjTiles[i].isMine) {
  //     mineCount++;
  //   }
  // }
  return adjTiles;
}

//helper function to generate random integers between 0 (inclusive) and provided maximum (exclusive)
var getRandomInt = function(max){
  return Math.floor((Math.random() * max));
};

//helper funciton to set click listeners on tiles
var setClickListener = function(tileSpaceElement, boardData){
  var tileBack = tileSpaceElement.find('.tile-back');
  tileSpaceElement.mouseup(function(click){
    switch (click.which) {
      //ON LEFT CLICK:
      case 1:
        //if clicked tile is flagged, do nothing and break
        if (tileSpaceElement.hasClass('flagged')) {
          break;
        }
        var x, y;
        //get coordinates
        x = tileSpaceElement.data('location').x;
        y = tileSpaceElement.data('location').y;
        //check boardData for mine
        if (boardData[x][y].isMine)
        {
          tileSpaceElement.addClass('clicked show-mine');
          alert('you clicked on a mine');

        //if the clicked tile is not already revealed
        } else if (!tileSpaceElement.hasClass('clicked')){
          //if the tile's numerical value is not empty
          if (!boardData[x][y].isEmpty){
            //add a span containing the tile's numerical value
            tileBack.append('<span class="tile-value">'+ boardData[x][y].tileValue +'</span>');
            tileSpaceElement.addClass('clicked');
          }
          //otherwise, initiate recursive tile reveal
          else {
            // tileSpaceElement.addClass('clicked');

            //recursively flip adjacent empty tiles
            chainFlip(boardData[x][y]);
          }
        }
        break;

      //ON MIDDLE CLICK:
      case 2:
        //do nothing on middle mouse click
        break;

      //ON RIGHT CLICK:
      case 3:

        //toggle flagged class on tile element
        tileSpaceElement.toggleClass('flagged');
        break;

      default:
        console.log('weird mouse alert!');
    }
  });
}

var chainFlip = function(tile, delayCount){
  tile.recursed = true;
  var delay = delayCount || 0;
  //get array of tiles surrounding tileElement
  var neighbors = myGame.board.getNeighborTiles(tile);
  console.log("tile "+tile.x + " " + tile.y + " has "+neighbors.length+" neighbors");
  //for each tile in array
  for (var i = 0; i < neighbors.length; i++) {
    //if tile is empty, call chainFlip on that tile
    if (!neighbors[i].isMine && !neighbors[i].recursed){
      chainFlip(neighbors[i], delay+1);
    }
  }

  //if the tile has a number value and that value hasn't been added to its tile-back yet
  if (!tile.isEmpty){
    //add a span containing the tile's numerical value
    tile.element.find('.tile-back').empty();
    tile.element.find('.tile-back').append('<span class="tile-value">'+ tile.tileValue +'</span>');
  }
  setTimeout(function(){
    tile.element.addClass('clicked');
  }, (75 * delayCount));

}


//GLOBAL VARIABLES
const DEFAULT_BOARD_SIZE = 5;

// define media query for medium and large desktop sizes
const mqMedium = window.matchMedia("(min-width: 770px)");
const mqLarge = window.matchMedia("(min-width: 1200px)");
//set tile width based on window size
console.log(mqMedium);
console.log(mqLarge);
if (mqLarge.matches){//window has a minimum width of 1000px
  var TILE_WIDTH_PX = 100;
  console.log(TILE_WIDTH_PX);
} else if(mqMedium.matches){//window has a minimum width of 770px
  var TILE_WIDTH_PX = 70;
  console.log(TILE_WIDTH_PX);
} else { //window width is smaller than 770px
  var TILE_WIDTH_PX = 49;
  console.log(TILE_WIDTH_PX);
}

// var tileSize = function(){
//   var mqMedium = window.matchMedia("(min-width: 770px)");
//   var mqLarge = window.matchMedia("(min-width: 1200px)");
//   console.log(mqMedium);
//   console.log(mqLarge);
//   if (mqLarge.matches){//window has a minimum width of 1000px
//     var TILE_WIDTH_PX = 100;
//     console.log(TILE_WIDTH_PX);
//   } else if(mqMedium.matches){//window has a minimum width of 770px
//     var TILE_WIDTH_PX = 70;
//     console.log(TILE_WIDTH_PX);
//   } else { //window width is smaller than 770px
//     var TILE_WIDTH_PX = 49;
//     console.log(TILE_WIDTH_PX);
//   }
// }
// tileSize();

var myGame;

//jquerey
$(function(){
  myGame = new Game($('#minesweeper1'), DEFAULT_BOARD_SIZE);
  // myGame.drawBoard();

  $('#game-settings').submit(function(event){
    event.preventDefault();
    var size = $('#board-size').val();
    myGame = new Game($('#minesweeper1'), size);
  });

  $('#theme-selector').submit(function(event){
    event.preventDefault();
    var choice = $('#theme-choice').val();
    if (choice === "1") {
      $("body").removeClass().addClass("theme1");
    } else if (choice === "2") {
      $("body").removeClass().addClass("theme2");
    } else if (choice === "3") {
      $("body").removeClass().addClass("theme3");
    } else if (choice === "default") {
      $("body").removeClass();
    }
  });

  $("#question-mark").click(function() {
    $("#how-to").add('horizTranslate');
    $("#how-to").show();
  });

  $("#hide").click(function() {
    $("#how-to").hide();
  });
});
