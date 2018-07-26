var w;
var columns;
var rows;
var board;
var next;

function setup() {
  createCanvas(250, 200);
  w = 5;
  // Calculate columns and rows
  columns = floor(width/w);
  rows = floor(height/w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (var i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  } 
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(255);
  generate();
  for ( var i = 0; i < columns;i++) {
    for ( var j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill(0);
      else fill(255); 
      stroke(0);
      rect(i*w, j*w, w-1, w-1);
    }
  }
  console.log("draw");
}

// reset board when mouse is pressed
function mousePressed() {
  init();
}

// Fill board randomly
function init() {
   //next[i][j] = 0;
    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
          // Lining the edges with 0s
          //if (i == 0 || j == 0 || i == columns-1 || j == rows-1) 
          board[i][j] = 0;
          // Filling the rest randomly
          //else board[i][j] = floor(random(2));
          next[i][j] = 0;
        }
    }
    board[1][5]=1;
    board[1][6]=1;
    board[2][5]=1;
    board[2][6]=1;
    board[11][5]=1;
    board[11][6]=1;
    board[11][7]=1;
    board[12][4]=1;
    board[12][8]=1;
    board[13][3]=1;
    board[13][9]=1;
    board[14][3]=1;
    board[14][9]=1;
    board[15][6]=1;
    board[16][4]=1;
    board[16][8]=1;
    board[17][5]=1;
    board[17][6]=1;
    board[17][7]=1;
    board[18][6]=1;
    board[21][3]=1;
    board[21][4]=1;
    board[21][5]=1;
    board[22][3]=1;
    board[22][4]=1;
    board[22][5]=1;
    board[23][2]=1;
    board[23][6]=1;
    board[25][1]=1;
    board[25][2]=1;
    board[25][6]=1;
    board[25][7]=1;
    board[35][3]=1;
    board[35][4]=1;
    board[36][3]=1;
    board[36][4]=1;
    board[35][22]=1;
    board[35][23]=1;
    board[35][25]=1;
    board[36][22]=1;
    board[36][23]=1;
    board[36][25]=1;
    board[36][26]=1;
    board[36][27]=1;
    board[37][28]=1;
    board[38][22]=1;
    board[38][23]=1;
    board[38][25]=1;
    board[38][26]=1;
    board[38][27]=1;
    board[39][23]=1;
    board[39][25]=1;
    board[40][23]=1;
    board[40][25]=1;
    board[41][24]=1;
    }
  

// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (var x = 1; x < columns - 1; x++) {
    for (var y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      var neighbors = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
      else                                             next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  var temp = board;
  board = next;
  next = temp;
}
