// A weekend project of generative art thingy
// heavily influenced by Daniel Shiffman and his Nature of Code book


let viruses = [];
let population = 200; // number of people in the simulation
let virus_size = 20; // size of the individual people in the simulation

let canvas_x = 800;
let canvas_y = 600;

let max_sick = 150;
let max_immune = 200;

function setup() {
    createCanvas(canvas_x, canvas_y);

    // create population
    for (let i = 0; i < population; i++) {
        viruses[i] = new Virus(random(2 * virus_size, width - 2 * virus_size), random(2 * virus_size, height - 2 * virus_size));
    }

}

// add to the population when you drag mouse
function mouseDragged() {
    viruses.push(new Virus(mouseX, mouseY));
}

function try_button() {
    for (let i = 0; i < 10; i++) {
        viruses.push(new Virus(random(2 * virus_size, width - 2 * virus_size), random(2 * virus_size, height - 2 * virus_size)));
    }
}

function draw() {

    // this will clear the screen so there is no trace of previous population on each cycle
    background(0, 0, 0, 100)

    // go through all the population an run the various updates
    // most of the code is in the class Virus
    for (let i = 0; i < viruses.length; i++) {
        viruses[i].run(viruses);
    }
}