// SPAWNER CLASS
function spawner() {

    var spawnSquareOrCircle = function(isSquare, isCircle) {
        var x, y,   // coords
            w, h,   // width/height
            color,
            v,      // speed
            angle;  // moving angle
	
        // managing spawn chance for each enemy type
        switch (Math.floor(Math.random() * 6)){
            case 0:
                    w = h = 35;
                    color = "blue";
                    v = 0.0425 + 0.015 * Math.random();
                    break;
            case 1:
            case 2:
                    w = h = 25;
                    color = "red";
                    v = 0.085 + 0.03 * Math.random();
                    break;
            case 3:
            case 4:
            case 5:
                    w = h = 15;
                    color = "green";
                    v = 0.17 + 0.06 * Math.random();
                    break;
        }
        x = W;
        y = HeaderH + (H - HeaderH - h) * Math.random();
        angle = Objects.getCurrentAngle();
		
        if (isSquare) {
            Objects.add(new bRect(x, y, w, h, color, v, angle));
        }
        if (isCircle) {
            Objects.add(new bCircle(x + w/2, y + w/2, w/2, color, v, angle));
        }
    }
	
    this.spawnSquare = function(num) {
        for (var i = 0; i < num; i++) {
            spawnSquareOrCircle(true, false);
        }
        Game.spawned(num);
    }

    this.spawnCircle = function(num) {
        for (var i = 0; i < num; i++) {
            spawnSquareOrCircle(false, true);
        }
        Game.spawned(num);
    }

    this.spawnRandom = function(num) {
        for (var i = 0; i < num; i++) {
            var flag = Math.floor(Math.random() * 2); // = 0 or 1
            spawnSquareOrCircle(flag, !flag);
        }
        Game.spawned(num);
    }

    this.spawnMorphed = function(type, x, y, targetDimension, targetSpeed) {
        var x = x, y = y,                       // coords
            w = targetDimension,                // width
            h = targetDimension,                // height
            v = targetSpeed,                    // speed
            angle = Objects.getCurrentAngle(),  // moving angle
            color;
        
        switch (targetDimension) {
            case 35:
            case 35/2:
                    color = "blue";
                    break;
            case 25:
            case 25/2:
                    color = "red";
                    break;
            case 15:
            case 15/2:
                    color = "green";
                    break;
        }
        
        switch (type) {
            case "rect":
                Objects.add(new bRect(x, y, w, h, color, v, angle));
                break;
            case "circle":
                Objects.add(new bCircle(x, y, targetDimension, color, v, angle));
                break;
        }
    }

}
