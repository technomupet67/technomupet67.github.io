// A weekend project of generative art thingy
// heavily influenced by Daniel Shiffman and his Nature of Code book
// tryinng to reproduce a wave on this occasion


let waves = [];
let population = 16; // number of people in the simulation
let wave_size = 10; // size of the individual parts in the simulation

let canvas_x = 16 * 40;
let canvas_y = 16 * 40;

let max_foam = 300;

let cohesion_dist = 50;
let incr = 0;

let debug_text = false;

function setup() {
    createCanvas(canvas_x, canvas_y);
    // gives a bit of a fuzzy look
    frameRate(40);

    // create population
    for (let i = 0; i < population; i++) {

        let x = random(2 * wave_size, width - 2 * wave_size);
        let y = random(2 * wave_size, height - 2 * wave_size);
        let adj = map(y, 0, height, 0, 255);
        let c = color(50, adj, 255, 150);

        waves[i] = new Particule(x, y, c);
    }

}

// add to the population when you drag mouse
function mouseDragged() {
    let x = mouseX;
    let y = mouseY;
    let adj = map(y, 0, height, 0, 255);
    let c = color(50, adj, 255, 100);
    waves.push(new Particule(x, y, c));
}

function keyPressed(SPACE) {
    debug_text = !debug_text;
}

// a button on the index page to add 10 items
function try_button() {
    let x = random(2 * wave_size, width - 2 * wave_size)
    let y = random(2 * wave_size, height - 2 * wave_size)
    let adj = map(y, 0, height, 0, 255);
    let c = color(50, adj, 255, 100);
    for (let i = 0; i < 10; i++) {
        waves.push(new Particule(x, y, c));
    }
}

// a button on the index page to kill 10 items
function kill_button() {
    for (let i = 10; i > 0; i--) {
        waves.splice(i, 1);

    }
}




// this is the main loop of the program
function draw() {

    // this is to create the trail effect lower alpha to elongate trail
    fill(0, 7);
    rect(0, 0, width, height);


    // for debug and check where things are hidden
    // rotate(-PI/10);
    if (debug_text) {
        fill(255, 255, 255);
        stroke(255, 255, 255, 255);
        textSize(14);
        text("Wave Program", 10, height - 50);
        text('Num. particules = ' + str(waves.length), 10, height - 30);

        text("Frame Rate : " + int(frameRate()), 10, height - 10);
    }
    // go through all the population an run the various updates
    // most of the code is in the class wave
    for (let i = 0; i < waves.length; i++) {
        waves[i].run(waves);
    }
}