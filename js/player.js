//PLAYER CLASS
function player() {

    var w = 32, h = 16,             // width, height
        // coords set to middle of screen
        x = canvas.width/5 - w/2,
        y = Math.floor(HeaderH + (canvas.height - HeaderH) / 2 - h / 2),
        
        color = "gray",
        v = 0.125,                  // speed     
        xModifier = 2, yFlag = 0;   // used for flame drawing

    this.isHit = false;
	
    this.getSides = function(){return {left: x, top: y, right: x+w, bottom: y+h};}
	
    this.move = function(diff) {
        xModifier = 2;
        yFlag = 0;
        // diplacements
        var dx = 0,
            dy = 0;
        
        if (Keys[UP] && !Keys[DOWN]) {
            dy = -v * diff;
            yFlag = 1;
            if (y - h/8 < HeaderH + 1) {
                y = HeaderH+1 + h/8;
            }
        }
        if (Keys[DOWN] && !Keys[UP]) {
            dy = v * diff;
            yFlag = -1;
            if (y + h + h/8 > canvas.height - 1) {
                y = canvas.height - 1 - h - h/8;
            }
        }
        if (Keys[LEFT] && !Keys[RIGHT]) {
            dx = -v * diff;
            xModifier = 1;
            if (x < 0) {
                x = 0;
            }
        }
        if (Keys[RIGHT] && !Keys[LEFT]) {
            dx = v * diff;
            xModifier = 4;
            if (x + w + w/8 > canvas.width) {
                x = canvas.width - w - w/8;
            }
        }
        
        if (dx && dy) {
            dx *= Math.cos(Math.PI / 4);
            dy *= Math.sin(Math.PI / 4);
        }
        
        x += dx;
        y += dy;
    }

    this.draw = function() {
        var temp = Drawing.fillStyle;
        
        if (this.isHit) {
            Drawing.fillStyle = "white";
            Drawing.strokeStyle = "black";
        } else {
            Drawing.fillStyle = "orange";
            Drawing.strokeStyle = "brown";
        }
        
        /* xModifier: 1 - moving back
         *            2 - standing
         *            4 - moving forward
         * yFlag:     0 - standing
         *            1 - moving up
         *            2 - moving down */
        
        // back fire
        Drawing.beginPath();
        Drawing.moveTo(x, y + h / 8);
        Drawing.lineTo(x - xModifier * h / 4, y + h / 2);
        Drawing.lineTo(x, y + 7 * h / 8);
        Drawing.closePath();
        Drawing.fill();
        Drawing.stroke();
        
        // side fire
        switch (yFlag) {
            case 0:
                break;
            case 1:
                Drawing.beginPath();
                Drawing.moveTo(x + 2 * w / 8, y + h);
                Drawing.lineTo(x + 3 * w / 8, y + h + 3 * h / 8);
                Drawing.lineTo(x + 4 * w / 8 , y + h);
                Drawing.closePath();
                Drawing.fill();
                Drawing.stroke();
                break;
            case -1:
                Drawing.beginPath();
                Drawing.moveTo(x + 2 * w / 8, y);
                Drawing.lineTo(x + 3 * w / 8, y - 3 * h / 8);
                Drawing.lineTo(x + 4 * w / 8, y);
                Drawing.closePath();
                Drawing.fill();
                Drawing.stroke();
                break;
        }
        
        // body
        if (this.isHit) {
            Drawing.fillStyle = "#FFCC00";
        } else {
            Drawing.fillStyle = color;
        }
        Drawing.beginPath();
        Drawing.moveTo(x, y - h / 8);
        Drawing.lineTo(x + w - w / 8, y);
        Drawing.lineTo(x + w + w / 8, y + h / 2);
        Drawing.lineTo(x + w - w / 8, y + h);
        Drawing.lineTo(x, y + h + h / 8);
        Drawing.closePath();
        Drawing.fill();
        
        Drawing.fillStyle = temp;
    }

}