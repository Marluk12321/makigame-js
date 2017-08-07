// RECT CLASS
function bRect(x, y, w, h, color, v, angle) {

    var x = x, y = y,       // coords
        w = w, h = h,       // width, height
        color = color,
        v = v,              // speed
        angle = angle,      // moving angle
        // x, y direction speed
        vx = v * Math.cos(angle),
        vy = v * Math.sin(angle),
        // morphing flags and data
        morphing = false,
        morphingComplete = false,
        targetDimension,
        targetSpeed,
        targetSpeedDiff;
    this.collided = false;  // collision with player, so it counts only once
    
    // info methods    
    this.getSides = function(){return {left: x, top: y, right: x+w, bottom: y+h}}

    this.getColor = function(){return color}
    
    // morph methods
    this.isMorphing = function(){return morphing}

    this.morphStart = function(morphingInto) {
        morphing = true;
        
        // determine target size and speed
        switch (morphingInto) {
            case "blue":
                targetDimension = w + 10;
                targetSpeed = v / 2;
                break;
            case "red":
                switch (color) {
                    case "blue":
                        targetDimension = w - 10;
                        targetSpeed = v * 2;
                        break;
                    case "green":
                        targetDimension = w + 10;
                        targetSpeed = v / 2;
                        break;
                }
                break;
            case "green":
                targetDimension = w - 10;
                targetSpeed = v * 2;
                break;
        }
        
        // set speed difference
        targetSpeedDiff = Math.abs(v - targetSpeed);
        
        // determine tranistion color
        switch (color) {
            case "blue":
                color = "purple";
                break;
            case "red":
                switch ( morphingInto ){
                    case "blue":
                        color = "purple";
                        break;
                    case "green":
                        color = "orange";
                        break;
                }
                break;
            case "green":
                color = "orange";
                break;
        }
    }

    var morphStep = function(diff){
        var stepDuration = 2000, // ms
            sizeStep = (10/stepDuration) * diff,
            speedStep = (targetSpeedDiff/stepDuration) * diff,
            done = false; // morphing done
            
        if (w < targetDimension) {
            // increase size
            x -= sizeStep;
            y -= sizeStep;
            w += sizeStep;
            h += sizeStep;
            // decrease speed
            v -= speedStep;
            
            if (w >= targetDimension) {
                done = true;
            }
        } else if (w > targetDimension) {
            // decrease size
            x += sizeStep;
            y += sizeStep;
            w -= sizeStep;
            h -= sizeStep;
            // increase speed
            v += speedStep;
            
            if (w <= targetDimension) {
                done = true;
            }
        }
        
        if (done) {
            morphingComplete = true;
            Spawner.spawnMorphed("rect", x, y, targetDimension, targetSpeed);
        }
    }

    this.morphEnd = function(){return morphingComplete;}
    
    // main methods
    this.move = function(diff, mainAngle) {
        // adjust speed if angle changed
        var turningDuration = 2000; // ms
        if (angle !== mainAngle) {
            angle += mainAngle>angle ?
            ((Math.PI/4) / turningDuration) * diff :
            (-(Math.PI/4) / turningDuration) * diff ;
            vx = v * Math.cos(angle);
            vy = v * Math.sin(angle);
        }
        
        // morphing
        if (morphing && !morphingComplete) {
            morphStep(diff);
        }
        
        x += vx * diff;
        y += vy * diff;
		
        var out = false;
        if (x < -w && vx < 0) {
            out = true;
        }
        
        if (y + h < HeaderH || y > H) {
            y = vy < 0 ? H : HeaderH - h;
        }
		
        return out;
    }

    this.draw = function() {
        var temp = Drawing.fillStyle;
        
        Drawing.fillStyle = color;
        Drawing.fillRect(x, y, w, h);
        
        Drawing.fillStyle = temp;
        
        //if (morphing) errorlog.innerHTML += w + "</br>"
    }

}
