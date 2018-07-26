/**
 * Setup a canvas
 * Split into four quardants
 * Apply Koch Curves to eah
 * Draw a star over them
 * - Next create a 1D CA variant
 * - Then 2D CA Variants with moevement
 */

var width = 512;
var height = 512;
var img; 
var timer = 0;
var images;
var img_idx = 0;
var bg_count = 0;

// starfield
var stars = [],
    WIDTH = width;//window.innerWidth,
    HEIGHT = height;//window.innerHeight,
    FPS = 10, // Frames per second
    NUM_STARS = WIDTH;

// brownian motion
var num = 2000;
var range = 6;

var ax = [];
var ay = [];

// Boids
var boids = [];

// gol
var w;
var columns;
var rows;
var board;
var next;

//images
var berlin;
var natural;
var aladddin;
var ziggy;
var kooks;
var lodger;
var thin_white_duke;
var halloween_jack;

// Serp
var cells;
var generation = 0;
var ruleset = [0, 1, 0, 1, 1, 0, 1, 0]; // 31


var words = [
  {'boisot': 'Self, Clan, Fief, Market'},
  {'ca': 'Uniform, Repetitive, Random, Complex'},
  {'cynefyn': 'Obvious, Complicated, Complex, Chaos'},
  {'nonaka': 'Internalisation, Socialisation, Externlaiisation, Combimation'}
]

function preload() {
  //load images
  berlin = loadImage("./images/berlin.png");
  natural = loadImage("./images/natural.png");
  aladddin = loadImage("./images/aladdin.png");
  ziggy = loadImage("./images/ziggy.png");
  kooks = loadImage("./images/kooks.png");
  lodger = loadImage("./images/lodger.png");
  thin_white_duke = loadImage("./images/thin_white_duke.png");
  halloween_jack = loadImage("./images/halloween_jack.png");

  img_mobius = loadImage("./images/mobius_red_blue.png")

  images = [ berlin, natural, aladddin, ziggy, kooks, lodger, thin_white_duke, halloween_jack];
}

function setup() {
    background(0,0,0)
    var myCanvas = createCanvas(512, 512);
    myCanvas.parent("appCanvas")
    
    for (var i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: 0,
      y: 0,
      offset: Math.random() * 360,
      // Weight orbit a little to be outside origin
      orbit: (Math.random()+0.01) * max(WIDTH, HEIGHT),
      radius: Math.random() * 2,
      vx: Math.floor(Math.random() * 10) - 5,
      vy: Math.floor(Math.random() * 10) - 5
    });
  }
   // Add an initial set of boids into the system
  for (var i = 0; i < 100; i++) {
    boids[i] = new Boid(random(width), random(height));
  }

  // Gol  createCanvas(250, 200);
  w = 15;
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

  // Serp
  cells = Array(floor(width/w));
  for (var i = 0; i < cells.length; i++) {
    cells[i] = 0;
  }
  cells[cells.length/2] = 1;
}

function draw() {

  timer++;

  // Respond to background
  var back_disp = selectAll(".back_disp");
  var cbx_back = back_disp[0].value();
  

  switch(cbx_back) {
    case("Star Field"):
      drawStars();
      break;
  
    case("Cellular Automata"):
      drawGol();
      break;

    case("Flocking"):
      drawBoids();
      break;

    case("Hierarchy"):
      drawSerp();
      break;
  }

  fill(255, 255, 255);
  stroke(0, 0, 0);
  //drawRects();

  fill(255, 0, 120);
  //ellipse(mouseX, mouseY, 25, 25, 50);
  drawKoch();

  translate(255, 0)
  pop();

  star(0, 0, 110, 220, 5); 
  push();

  image(img_mobius, -65, 120);

  translate(-255, -255);

  // change image every second
  this.img_idx = floor(timer / 60);

  if (timer > 478) {
    bg_count = 1
    timer = 0
    init();
  }
  image(this.images[img_idx], 190, 200);

  //Quadrant Labels
  var bg_type = selectAll('.bg_type');
 

  // CBZ - Tidy up
  var cbx_text = bg_type[0].value();
  //console.log(bg_type[0].value());

  textSize(24);
  fill(255,0,0,255);
  stroke(255, 0, 0);
  switch(cbx_text) {

    case("Boisot"):
      text("Bureaucracy", 10, 30);
      text("Fief", 365, 30);
      text("Clan", 390, 498)
      text("Market", 10, 498);
      break;
    
    case "Cynefin":
      text("Complex", 10, 30);
      text("Complicated", 365, 30);
      text("Obvious", 390, 498)
      text("Chaos", 10, 498);
      break;

    case "Cellular Automata":
      text("Random", 10, 30);
      text("Repetition", 365, 30);
      text("Uniform", 390, 498)
      text("Complexity", 10, 498);
      break;

    case "Nonaka Takeuchi":
      text("Externalise", 10, 30);
      text("Combine", 365, 30);
      text("Internalise", 390, 498)
      text("Socialise", 10, 498);
      break;

    case "Known/Unkown":
      text("Unkown known", 10, 30);
      text("Known Unkown", 345, 30);
      text("Known Known", 340, 498)
      text("Unknown Unknown", 10, 498);
      break;

    case "Mine":
      text("Bureaucracy, Fief", 10, 30);
      text("Family, Clan, Team", 265, 30);
      text("Self", 390, 498)
      text("Social, Market", 10, 498);
      break;
 }
  // Star Labels
  textSize(14);
  fill(255);
  text("Chaos", 140, 380);
  text("Certainty", 300, 380);
  text("Complex", 110, 210);
  text("Clarity", 365, 210);
  text("Confusion", 225, 140);

}

function drawStars() {
  // starfield
  background(24, 24, 24);
  push();
  noFill();
  colorMode(RGB, 255, 255, 255, 1);
  stroke(240,240,240, 1);
  strokeCap(ROUND);
  strokeWeight(2);
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
    ellipse(s.x, s.y, s.radius, 0);
  }
  pop();
  update();
  // end starfield  
}

function drawRects() {
    textSize(32);
    rect(0, 0, 255, 255)
    rect(256, 0, 255, 255);
    rect(256, 256, 255, 255);
    rect(0, 256, 255, 255);
}


function drawKoch() {
    stroke(0);

    // top left - red
    stroke(255, 0, 0);
    line(0, 128, 256, 128);

    // top right - green
    translate(256, 0);
    stroke(0, 255, 0);
    line(0, 128, 256, 128);

    // bottom right - blue
    stroke(0, 0, 255);
    translate(0, 256);
    line(0, 128, 256, 128);

    // bottom left - black
    stroke(0, 255, 255);
    translate(-256, 0);
    line(0, 128, 256, 128);
}


function star(x, y, radius1, radius2, npoints) {
  fill(0);
  stroke(255);
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = .95; a < TWO_PI; a += angle) {
    var i = 1;
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
    text(x, y, i)
  }
  endShape(CLOSE);
}

function update() {
  var originX = WIDTH / 2;
  var originY = HEIGHT / 2;
  
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
    
    
    var rad = (frameCount * (1/(s.orbit*2 + s.offset)) + s.offset) % TAU;
    s.x = (originX + cos(rad)*(s.orbit*2));
    s.y = (originY + sin(rad)*(s.orbit));
  }
}

function drawBrownian() {
  //background(51);

  // Shift all elements 1 place to the left
  push();
  for ( var i = 1; i < num; i++ ) {
    ax[i - 1] = ax[i];
    ay[i - 1] = ay[i];
  }

  // Put a new value at the end of the array
  ax[num - 1] += random(-range, range);
  ay[num - 1] += random(-range, range);

  // Constrain all points to the screen
  ax[num - 1] = constrain(ax[num - 1], 0, width);
  ay[num - 1] = constrain(ay[num - 1], 0, height);

  // Draw a line connecting the points
  for ( var j = 1; j < num; j++ ) {
    var val = j / num * 204.0 + 51;
    stroke(val);
    line(ax[j - 1], ay[j - 1], ax[j], ay[j]);
  }
  pop();
}

// boids

function drawBoids() {
    background(0);
    for (var i = 0; i < boids.length; i++) {
    boids[i].run(boids);
  }
}

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

// Forces go into acceleration
Boid.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids); // Separation
  var ali = this.align(boids);    // Alignment
  var coh = this.cohesion(boids); // Cohesion
  // Arbitrarily weight these forces
  sep.mult(2.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset acceleration to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force
  return steer;
}

// Draw boid as a circle
Boid.prototype.render = function() {
  fill(127, 127);
  stroke(200);
  ellipse(this.position.x, this.position.y, 16, 16);
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  var desiredseparation = 25.0;
  var steer = createVector(0, 0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum); // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}


// Gol

function drawGol() {

}

function init() {
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
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

function drawGol() {
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
}


function init() {
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
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

// Serp

function drawSerp() {
  for (var i = 0; i < cells.length; i++) {
    if (cells[i] === 1) {
      fill(255);
    } else {
      fill(51);
      noStroke();
      rect(i*w, generation*w, w, w);
    }
  }
  if (generation < height/w) {
    generateSerp();
  } else {
    generation = 0;
  }
}

// The process of creating the new generation
function generateSerp() {
  // First we create an empty array for the new values
  var nextgen = Array(cells.length);
  // For every spot, determine new state by examing current state, and neighbor states
  // Ignore edges that only have one neighor
  for (var i = 1; i < cells.length-1; i++) {
    var left   = cells[i-1];   // Left neighbor state
    var me     = cells[i];     // Current state
    var right  = cells[i+1];   // Right neighbor state
    nextgen[i] = rules(left, me, right); // Compute next generation state based on ruleset
  }
  // The current generation is the new generation
  cells = nextgen;
  generation++; 
  console.log(generation);
}


// Implementing the Wolfram rules
// Could be improved and made more concise, but here we can explicitly see what is going on for each case
function rules(a, b, c) {
  if (a == 1 && b == 1 && c == 1) return ruleset[0];
  if (a == 1 && b == 1 && c == 0) return ruleset[1];
  if (a == 1 && b == 0 && c == 1) return ruleset[2];
  if (a == 1 && b == 0 && c == 0) return ruleset[3];
  if (a == 0 && b == 1 && c == 1) return ruleset[4];
  if (a == 0 && b == 1 && c == 0) return ruleset[5];
  if (a == 0 && b == 0 && c == 1) return ruleset[6];
  if (a == 0 && b == 0 && c == 0) return ruleset[7];
  return 0;
}

// end Serp