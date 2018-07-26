function setup() {
    background(100,100,100)
    createCanvas(300, 300);
}

function draw() {

    noStroke();

  fill(255, 0, 0);
  //rect(100, 100, 200, 200);

  fill(255, 0, 120);
  ellipse(mouseX, mouseY, 25, 25, 50);
}

function mousePressed() {
    clear();
}