/**
 * Create a box to determine position of mouse move or touch
 */
function Box(x1, y1, x2, y2) {
  this.box_x1 = x1;
  this.box_y1 = y1;
  this.box_x2 = x2;
  this.box_y2 = y2;  

  var tooltip = '';

 this.isInside = function(mx, my){
   //console.log(this.box_x1);
    if (mx >= this.box_x1 && mx <= this.box_x2) {
      if (my >= this.box_y1 && my <= this.box_y2) {
        console.log("In box");
        return true;
      }
    }
    return false;
  }

  this.update = function(_newX) {
    this.box_x1 = _newX;
    this.box_x2 = _newX + 10;
  }

  // Quck fix while sketching the customer value for ADSR
  this.updateY = function(_newY) {
    this.box_y1 = _newY;
    this.box_y2 = _newY + 10;
    console.log('in the box ' + this.box_y1, this.box_y1, _newY);
  }

}