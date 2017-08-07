// OBJECT MANAGER CLASS
function objectManager() {

    var Player = new player(),
        // enemies sorted by type/color
        all = {blue: [], red: [], green: []},
        // movement angle for all objects
        angle = Math.PI,    // jumps
        realAngle = angle,  // changes gradually
        /* state for the turning rotation 
         * 0: normal angle, previously down
         * 1: upwards angle
         * 2: normal angle, previously up
         * 3: downwards angle */
        turningState = 0;
	
    var turn = function() {
        switch (turningState) {
            case 0:
                angle = 5 * Math.PI/6;
                break;
            case 1:
                angle = Math.PI;
                break;
            case 2:
                angle = 7 * Math.PI/6;
                break;
            case 3:
                angle = Math.PI;
                break;
        }
        
        turningState = (turningState + 1) % 4;
    }

    var morphRoll = function() {
        var rollChance = 30000, // 1 in how many for success
            rollResult = Math.floor(Math.random() * rollChance);
        
        // return true only if result == 0
        return !rollResult;
    }

    var morphTargetRoll = function(morphingFrom) {
        switch (morphingFrom) {
            case "blue":
            case "green":
                return "red";
            case "red":
                var rollResult = Math.floor(Math.random() * 2); // = 0 or 1
                if (rollResult) {
                    return "blue";
                } else {
                    return "green";
                }
        }
    }
        
    this.getCurrentAngle = function(){return realAngle;}

    this.add = function(obj) {
        all[obj.getColor()].push(obj);
    }

    this.moveAll = function(diff) {
        // turn all enemies if the time has come
        if (Game.canTurn()) {
            turn();
        }
        // adjust angle to new angle
        var turningDuration = 2000; // ms
        if (realAngle !== angle) {
            realAngle += angle > realAngle ?
            ((Math.PI/4) / turningDuration) * diff :
            (-(Math.PI/4) / turningDuration) * diff;
        }
        
        var outCount = 0; // for couting despawned enemies
        for (var i in all) {
            for (var j in all[i]) {
                // remove enemy out of screen
                if (all[i][j].move(diff, realAngle)) {
                    all[i].splice(j,1);
                    outCount++;
                // morphing roll, if success start morphing
                } else if (!all[i][j].isMorphing() && morphRoll()) {
                    var morphingFrom = all[i][j].getColor(),
                        morphingInto = morphTargetRoll(morphingFrom);
                    all[i][j].morphStart(morphingInto);
                // if morphing done (it respawned), remove enemy
                } else if (all[i][j].isMorphing() && all[i][j].morphEnd()) {
                    all[i].splice(j, 1);
                }
            }
        }
        
        Player.move(diff);
        
        // respawn despawned enemies
        if (outCount) {
            Game.despawned(outCount);
            Spawner.spawnRandom(outCount);
        }
    }

    this.drawAll = function() {
        // clipping - no drawing over header
        Drawing.save();
        Drawing.rect(0, HeaderH, W, H - HeaderH);
        Drawing.clip();
        
        for (var i in all.blue) {
            all.blue[i].draw();
        }
        for (var i in all.red) {
            all.red[i].draw();
        }
        for (var i in all.green) {
            all.green[i].draw();
        }
        Player.draw();
        
        Drawing.restore();
    }

    this.checkCollisions = function() {
        var sum = 0,    // for counting all new collisions
            playerHit = false,
            pSides = Player.getSides(),
            other;
    
        for (var i in all) {
            for (var j in all[i]) {
                other = all[i][j].getSides();
                //collsion condition
                if (other.left < pSides.right &&
                    other.top < pSides.bottom &&
                    other.right > pSides.left &&
                    other.bottom > pSides.top) {
                    if (!all[i][j].collided) {
                        all[i][j].collided = true;
                        sum++;						
                    }
                    playerHit = true;
                } else if (all[i][j].collided) {
                    all[i][j].collided = false;
                }
            }
        }
        Player.isHit = playerHit;
        return sum;
    }

}
