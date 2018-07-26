/**
 * Create a psudo muti-tab for the value displays
 *
 * Display has to be relative in the small
 * Use the highest value on the curves for WSJF jobs
 * Show the differences between collective dimensions
 */
function ValueButton(_x, x_off, _y, y_off, name) {
  this.x = _x;
  this.x_off = x_off;
  this.y = _y;
  this.y_off = y_off
  this.width = 40;
  this.height = 20;
  this.name = name;
  this.selected = false;
  this.tooltip;

 this.isInside = function(mx, my){
   //console.log("Button check " + this.name);

    if (mx >= (this.x + this.x_off) && mx <= (this.x + this.x_off + + this.width) ) {
      if (my >= (this.y + this.y_off) && my <= (this.y  + this.y_off + this.height) ) {
        console.log("In ValueButton >>> " + this.name);
        this.selected = true;
        if (this.selected) {
          //this.selected =!this.selected;
          return true;
        }
      }
    }
    return false;
  }

  this.display = function() {
    //console.log(this.name);
    // noFill();
    // stroke(0);
    // rect(this.x, this.y, this.width, this.height)
      stroke(0);
      if (this.selected) {
          fill(255);
          rect(this.x, this.y, this.width, this.height);
        } else {
          fill(255, 255, 255);
          stroke(0);
          rect(this.x, this.y, this.width, this.height);
        }
        stroke(255);
        // fill(0);
        // text(this.name, this.x, this.y + 18);
  }

}