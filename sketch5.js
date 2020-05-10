// A weekend project of generative art thingy
// heavily influenced by Daniel Shiffman and his Nature of Code book


let viruses = [];
let population = 500; // number of people in the simulation
let virus_size = 8; // size of the individual people in the simulation

let canvas_x = 800;
let canvas_y = 600;


function setup() {
    createCanvas(canvas_x, canvas_y);

    // create population
    for (let i = 0; i < population; i++) {
        viruses[i] = new Virus(random(width), random(height));
    }

}

function draw() {

    // this will clear the screen
    background(0, 0, 0, 100)

    for (let i = 0; i < viruses.length; i++) {
        viruses[i].run(viruses);
    }
}