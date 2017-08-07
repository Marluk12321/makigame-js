// GAME CLASS
function gameStuff() {

    var startTime = then = Date.now(),  // 'then' used for deltatime
        interval,                       // for storing main loop interval
        spawnFlag = false,              // for enemy spawn permission
        turnFlag = false,               // for enemy turning permission
        collisionCounter = 0,           // counts player collisions, lives = 10 - collisions
        spawnCounter = 0,               // counts spawned enemies
        endFlag = false,                // game over flag
        
        // for background draw changes
        collisionCounterOld = collisionCounter,
        spawnCounterOld = spawnCounter,
        secondsOld = 0,
        
        // flags for game pause
        paused = [false, true];
        
    Drawing.font = "17px Arial";
    
    var restart = function() {
        // reset timers, counters and flags
        startTime = then = Date.now();
        collisionCounter = spawnCounter = 0;
        spawnFlag = false,
        turnFlag = false,
        endFlag = false,
        paused = [false, true];
        
        // reset objects
        Objects = new objectManager();
        collisionCounter += Objects.checkCollisions();
        drawBG(false);
        Objects.drawAll();
    }

    // premission for spawning enemies
    var canSpawn = function() {
        if (spawnCounter >= 90) {
            return false;
        }

        //deciseconds
        var dseconds = Math.floor((Date.now() - startTime) / 100),
            spawnInterval = 25;

        // returns true every time the interval passes
        // 'spawnflag' used to limit 1 spawn in the decisecond
        if (dseconds % spawnInterval === 0 && dseconds > 0) {
            if(!spawnFlag) {
                spawnFlag = true;
                return true;
            } else {
                return false;
            }
        } else {
            spawnFlag = false;
            return false;
        }
    }

    // returns miliseconds passed since last call
    var getDeltaTime = function() {
        var now = Date.now(),
            delta = now - then;
        then = now;
        return delta;
    }

    // handles pause - unpaused transitions, paused
    var handlePause = function() {
        if (!Keys[P]) {
            paused[1] = true;
        }
        if (Keys[P] && paused[1]) {
            paused[0] = !paused[0];
            paused[1] = false;
            // pause: draw PAUSED sign
            if (paused[0]) {
                var tempFS = Drawing.fillStyle,
                    tempSS = Drawing.strokeStyle,
                    tempF = Drawing.font,
                    tempTA = Drawing.textAlign,

                    w = 110, h = 40; // rect width/height

                Drawing.fillStyle = "#CC6633";
                Drawing.fillRect(W/2 - w/2, H/2 + HeaderH - h/2, w, h);
                Drawing.strokeStyle = "black";
                Drawing.beginPath();
                Drawing.rect(W/2 - w/2, H/2 + HeaderH - h/2, w, h);
                Drawing.closePath();
                Drawing.stroke();

                Drawing.fillStyle = "black";
                Drawing.font = "20px Arial";
                Drawing.textAlign = "center";
                Drawing.fillText("PAUSED",
                                W/2, H/2 + HeaderH + 7);

                Drawing.fillStyle = tempFS;
                Drawing.strokeStyle = tempSS;
                Drawing.font = tempF;
                Drawing.textAlign = tempTA;
            }
            /* unpause:
             * adds pause time to starttime for calulations
             * deltatime resets */
            if (!paused[0]) {
                startTime += getDeltaTime();
            }
        }
        // returns true if the game is paused, false if not
        if (paused[0]) {
            return true;
        } else {
            return false;
        }
    }

    var gameOver = function() {
        // draws GAME OVER sign
        var tempFS = Drawing.fillStyle,
            tempSS = Drawing.strokeStyle,
            tempF = Drawing.font,
            tempTA = Drawing.textAlign,

            w = 140, h = 40; // rect width/height
        
        Drawing.fillStyle = "#CC6633";
        Drawing.fillRect(W/2 - w/2, H/2 + HeaderH - h/2, w, h);
        Drawing.strokeStyle = "black";
        Drawing.beginPath();
        Drawing.rect(W/2 - w/2, H/2 + HeaderH - h/2, w, h);
        Drawing.closePath();
        Drawing.stroke();

        Drawing.fillStyle = "black";
        Drawing.font = "20px Arial";
        Drawing.textAlign = "center";
        Drawing.fillText("GAME OVER",
                        W/2, H/2 + HeaderH + 7);

        Drawing.fillStyle = tempFS;
        Drawing.strokeStyle = tempSS;
        Drawing.font = tempF;
        Drawing.textAlign = tempTA;
        
        endFlag = true;
    }

    var drawBG = function(isFirst) {
        // first time running function
        if (isFirst) {
            // background for header
            Drawing.fillStyle = "#CC6633";
            Drawing.fillRect(0, 0, W, 25);
            // black line
            Drawing.fillStyle = "black";
            Drawing.fillRect(0, 25, W, 2);
            
            // lives remaining and enemies spawned counter display
            Drawing.textAlign = "left";
            Drawing.fillText("Lives: " +
                    ( collisionCounter>0 ? "0"+(10-collisionCounter) : 10-collisionCounter ) +
                    "     Enemies: " + spawnCounter, 4, 18);
            
            // time elapsed display
            var time = Date.now() - startTime,
                    minutes = Math.floor( (time/1000) / 60 ),
                    seconds = Math.floor( (time/1000) ) % 60;
            Drawing.textAlign = "right";
            Drawing.fillText("Time elapsed: " +
                    (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds),
                    W - 4, 18);	
        }
        // draws if collision counter changed
        if (collisionCounter !== collisionCounterOld) {
            collisionCounterOld = collisionCounter;

            Drawing.fillStyle = "#CC6633";
            Drawing.fillRect(51, 6, 21, 12);

            Drawing.fillStyle = "black";
            Drawing.textAlign = "left";
            Drawing.fillText( (collisionCounter > 0 ? "0" + (10 - collisionCounter) : 10 - collisionCounter),
                    51, 18);
        }
        // draws if spawn counter changed
        if (spawnCounter !== spawnCounterOld) {
            spawnCounterOld = spawnCounter;

            Drawing.fillStyle = "#CC6633";
            Drawing.fillRect(167, 6, 29, 12);

            Drawing.fillStyle = "black";
            Drawing.textAlign = "left";
            Drawing.fillText(spawnCounter, 167, 18);
        }
        
        var time = Date.now() - startTime,
            minutes = Math.floor((time / 1000) / 60),
            seconds = Math.floor(time / 1000) % 60;
        if (minutes >= 60) {
            minutes = seconds = 59;
        }
        // draws if a second passed
        if (seconds !== secondsOld){
            secondsOld = seconds;
                    
            Drawing.fillStyle = "#CC6633";
            Drawing.fillRect(W-46, 6, 42, 12);

            Drawing.fillStyle = "black";
            Drawing.textAlign = "right";
            Drawing.fillText((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds),
                    W-4, 18);
        }
	
        // main game background
        Drawing.fillStyle = "#FFCC99";
        Drawing.fillRect(0, 27, W, H - 22);
    }
        
    this.mainLoop = function() {
        // game restart condition
        if (Keys[R]) {
            restart();
        }
        // game end condition
        if (collisionCounter >= 10 && !endFlag) {
            gameOver();
        }
        if (endFlag) {
            return;
        }
        // game pause condition
        /* Keys[P]: P is pressed
         * paused[0]: game is paused
         * !paused[1]: waiting for P to be released */
        if (Keys[P] || paused[0] || !paused[1]) {
            var isPaused = handlePause();
        }
        if (isPaused) {
            return;
        }

        Objects.moveAll(getDeltaTime());
        if (canSpawn()) {
            Spawner.spawnRandom(3);
        }
        collisionCounter += Objects.checkCollisions();

        drawBG(false);
        Objects.drawAll();
    }

    this.start = function() {
        collisionCounter += Objects.checkCollisions();
        drawBG(true);
        Objects.drawAll();
        
        var temp = this;
        interval = setInterval(function(){return temp.mainLoop()}, 1);
    }

    this.canTurn = function() {
        var seconds = Math.floor((Date.now() - startTime) / 1000);
    
        if (seconds % 15 === 0 && seconds > 20) {
            if (!turnFlag) {
                turnFlag = true;
                return true;
            } else {
                return false;
            }
        } else {
            turnFlag = false;
            return false;
        }
    }

    this.spawned = function(num){spawnCounter += num}

    this.despawned = function(num){spawnCounter -= num}

}
