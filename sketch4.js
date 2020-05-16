// another potential animation for my rgb matrix

var Particle = [];
var nums = 100;

function setup() {
    size(128, 512);
    background(0);
    noStroke();
    setParticles();
}

function draw() {
    frameRate(25);
    // alpha = map(mouseX, 0, width, 5, 35);
    alpha = 35;

    fill(0, alpha);
    rect(0, 0, width, height);

}

// function setParticles() {
//     particles = new Particle[nums];
//     for (i = 0; i < nums; i++) {
//         x = random(windowWidth);
//         y = random(windowHeight);
//         adj = map(y, 0, height, 0, 255);
//         c = color(50, adj, 255);
//         particles[i] = new Particle(x, y, c);
//     }
// }

// function mousePressed() {
//     setParticles();
// }

// class Particle {

//     constructor Particle(xIn, yIn, cIn) {
//         posX = xIn;
//         posY = yIn;
//         c = cIn;
//     }

//     move() {
//         update();
//         wrap();
//         display();
//     }

//     update() {
//         incr += .01;
//         theta = noise(posX * .006, posY * .004, incr) * TWO_PI;
//         posX += 3 * cos(theta);
//         posY += 3 * sin(theta);
//     }

//     display() {
//         if (posX > 0 && posX < width && posY > 0 && posY < height) {
//             pixels[(int) posX + (int) posY * width] = c;
//         }
//     }

//     wrap() {
//         if (posX < 0) posX = width;
//         if (posX > width) posX = 0;
//         if (posY < 0) posY = height;
//         if (posY > height) posY = 0;
//     }
// }