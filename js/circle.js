// CIRCLE CLASS
function bCircle(x, y, r, color, v, angle) {

    var x = x, y = y,       // coords
        r = r,              // radius
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
    
    // info mehtods
    this.getSides = function() {
        // approximating circle as square, side = 0.8 * 2*r
        var approx = 0.8;
        return {left: x-r*approx, top: y-r*approx, right: x+r*approx, bottom: y+r*approx};
    }

    this.getColor = function() {
        return color;
    }
    
    // morph methods
    this.isMorphing = function() {
        return morphing;
    }

    this.morphStart = function(morphingInto) {
        morphing = true;
        
        // determine target size and speed
        switch (morphingInto) {
            case "blue":
                targetDimension = r + 5;
                targetSpeed = v / 2;
                break;
            case "red":
                switch (color) {
                    case "blue":
                        targetDimension = r - 5;
                        targetSpeed = v * 2;
                        break;
                    case "green":
                        targetDimension = r + 5;
                        targetSpeed = v / 2;
                        break;
                }
                break;
            case "green":
                targetDimension = r - 5;
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
                        color = "purple"
                        break;
                    case "green":
                        color = "orange"
                        break;
                }
                break;
            case "green":
                color = "orange";
                break;
        }
    }

    var morphStep = function(diff) {
        var stepDuration = 2000, // ms
            sizeStep = (5 / stepDuration) * diff,
            speedStep = (targetSpeedDiff / stepDuration) * diff,
            done = false; // morphing done
            
        if (r < targetDimension) {
            // increase size
            r += sizeStep;
            // descrease speed
            v -= speedStep;
            
            if (r >= targetDimension) {
                done = true;
            }
        } else if (r > targetDimension) {
            // decrease size
            r -= sizeStep;
            // increase speed
            v += speedStep;
            
            if (r <= targetDimension) {
                done = true;
            }
        }
        
        if (done) {
            morphingComplete = true;
            Spawner.spawnMorphed("circle", x, y, targetDimension, targetSpeed);
        }
    }

    this.morphEnd = function() {
        return morphingComplete;
    }
    
    // main methods
    this.move = function(diff, mainAngle) {
         // adjust speed if angle changed
        if (angle !== mainAngle) {
            angle = mainAngle;
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
        if (x < -r && vx < 0) {
            out = true;
        }
        
        if (y + r < HeaderH || y - r > canvas.height){
            y = vy < 0 ? canvas.height + r : HeaderH - r;
        }
		
        return out;
    }

    this.draw = function() {
        var temp = Drawing.fillStyle;
        
        Drawing.fillStyle = color;
        Drawing.beginPath();
        Drawing.arc(x, y, r, 0, Math.PI*2, true);
        Drawing.closePath();
        Drawing.fill();
        
        Drawing.fillStyle = temp;
    }

}
