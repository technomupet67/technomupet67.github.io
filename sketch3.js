var population_size = 20;
let alpha = 20;
let virus = []
function setup() {
    createCanvas(600, 600);
    background(51);

    for (let i = 0; i < population_size; i++) {
        virus[i] = new Virus(random(width), random(height));
    }

}

function draw() {

    for (let i = 0; i < population_size; i++) {
        virus[i].move();
        virus[i].show();
    }



}