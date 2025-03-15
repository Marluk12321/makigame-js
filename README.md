# makigame 2.0

My introduction to Javascript and HTML5 canvas graphics.

The player moves a spaceship to avoid incoming asteroids.
The goal is to survive as long as possible before the 10 lives run out.

The project also used as an introduction to git and code branches.
There are multiple branches present with an older alternative version of the game.

### bounce

The player controls a rectangle using arrow keys.
Every 10 seconds objects spawn at random locations along the edges and countinue moving while bouncing off edges until they hit the player rectangle and despawn. 
Smaller objects are faster and colored green, medium objects are colored red, and big objects are slowed and colored blue.

### teleport

Compared to "bounce", objects now spawn at less predictable times and only along the right edge while moving left.
When crossing the left edge, they respawn at the right edge at the same height.

### master

Most developed version of the game.
Introduces the ability pause and restart.
The spaceship now uses a more complex model and has animated jets that better visualize its movement.
Object that cross the left edge respawn at a random height to make it look more natural.
Objects can randomly morph into the smaller or larger version of itself and speed up or slow down accordingly.
After a certain time, all objects may smoothly change direction and go diagonally up or down instead of straight right-to-left.
This reverts after some time passes.

### inverse

An older alternative to "master" where larger objects are faster and green while smaller objects are slower and blue.
The idea behing this was to achieve the visual effect of closer objects appearing larger and faster and farther objects appearing smaller and slower.
While visually appealing, all objects are technically at the same depth as the spaceship in order to collide with it.
This also makes smaller objects a much lesser threat than bigger ones.
