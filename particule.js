// class of waves using a flock system
// heavily influenced by Daniel Shiffman and his coding train youtube videos
// as well as book the Nature of Code

class Particule {
    constructor(x, y, c) {
        this.acceleration = createVector(0, 0);
        this.velocity = p5.Vector.random2D();
        this.position = createVector(x, y);
        this.previous = createVector(x, y);
        this.r = wave_size; // used also for where to bounce off the sides
        this.maxspeed = 5;
        this.maxforce = 0.01;
        this.status = "normal"; // options could be status
        this.how_long_foam = 0;
        this.col = color(c);

    }

    run(waves) {
        
        this.basic_update();
        // this.flock(waves);
        this.borders();
        this.render();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    basic_update() {
        incr += 0.0002;
        let theta = noise(this.position.x * 0.01, this.position.y * 0.005, incr) * TWO_PI;
        // store previous location for line tracing
        this.previous.x = this.position.x;
        this.previous.y = this.position.y;
        // calculate new location
        this.position.x += -abs(5 * cos(theta));
        this.position.y += 1.5 * sin(theta);

        if (random(1, 500) == 50) {
            this.change_color();
        }

    }

    change_color() {
        let adj = map(y, 0, height, 0, 255);
        let c = color(50, adj, 255, 150);
        this.c = c;
    }

    flock(waves) {
        let sep = this.separate(waves);
        let ali = this.align(waves);
        let coh = this.cohesion(waves);
        let grav = this.gravity(waves);
        let bla = this.black_hole(waves);

        sep.mult(2.0);
        ali.mult(2.0);
        coh.mult(1.0);

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(grav);
        this.applyForce(bla);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);

        // kill the acceleration between loops
        this.acceleration.mult(0);

    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        return steer;
    }

    // draw the wave
    render() {
        if (this.status === "normal") {

            fill(this.col);
            stroke(this.col);
            ellipse(this.position.x, this.position.y, this.r, this.r);
            //rect(this.position.x, this.position.y, this.r, this.r);
            // strokeWeight(this.r);
            // line(this.position.x, this.position.y,this.position.x+10, this.previous.y);
        }



    }

    // bounce against the walls or fly accross screen etc...
    borders() {
        // if (this.position.x < this.r) this.velocity.mult(-1);
        if (this.position.x < (0 - this.r)) {
            this.position.x = width;
            this.previous = this.position;
        }

        // if (this.position.y < this.r) this.velocity.mult(-1);
        if (this.position.y < (0 - this.r)) {
            this.position.y = height;
            this.previous = this.position;
        }
        // if (this.position.x > width - this.r) this.velocity.mult(-1);
        if (this.position.x > width) {
            this.position.x = -this.r;
            this.previous = this.position;
        }
        // if (this.position.y > height - this.r) this.velocity.mult(-1);
        if (this.position.y > height) {
            this.position.y = -this.r;
            this.previous = this.position;
        }

    }

    separate(waves) {
        let desiredseparation = 35.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every person in the system, check if it's too close
        for (let i = 0; i < waves.length; i++) {
            let d = p5.Vector.dist(this.position, waves[i].position);
            // If people are close 
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, waves[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        }

        if (count > 0) {
            steer.div(count);
        }


        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }
        return steer;
    }

    align(waves) {
        let neighbordist = 10;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < waves.length; i++) {
            let d = p5.Vector.dist(this.position, waves[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(waves[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    cohesion(waves) {
        let neighbordist = cohesion_dist;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < waves.length; i++) {
            let d = p5.Vector.dist(this.position, waves[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(waves[i].position);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            return this.seek(sum);
        } else {
            return createVector(0, 0);
        }
    }

    gravity() {
        // 0,0 to remove gravity impact
        // values of 0.01 is ok on 
        let g = createVector(-0.005, 0.001);
        let x = mouseX;
        let y = mouseY;
        return g;
    }

    black_hole() {
        // here to create an attractor
        let b = createVector(0.0, 0.0);
        let x = mouseX;
        let y = mouseY;

        return b;

    }

}