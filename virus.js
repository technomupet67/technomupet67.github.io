// class of viruses using a flock system
// heavily influenced by Daniel Shiffman and his coding train youtube videos
// as well as book the Nature of Code

class Virus {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = p5.Vector.random2D();
        this.position = createVector(x, y);
        this.r = virus_size; // for where to bounce off the sides
        this.maxspeed = 5;
        this.maxforce = 0.05;
        this.health = "Healthy"; // options could be healthy, sick, dying, immune
        this.how_long_sick = 0;
        this.how_long_immune = 0;

    }

    run(viruses) {
        this.flock(viruses);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(viruses) {
        let sep = this.separate(viruses);
        let ali = this.align(viruses);
        let coh = this.cohesion(viruses);
        let grav = this.gravity(viruses);
        let bla = this.black_hole(viruses);

        sep.mult(2.0);
        ali.mult(1.0);
        coh.mult(1.5);

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(grav);
        this.applyForce(bla);

    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
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

    // draw the virus
    render() {
        if (this.health === "Healthy") {
            fill(200, 0, 250, 20);
            stroke(200, 0, 250);
            ellipse(this.position.x, this.position.y, virus_size, virus_size);
            // stroke(255,255,255);
            //ellipse(this.position.x, this.position.y, virus_size * this.velocity.x, virus_size* this.velocity.y );
        }
        if (this.health === "Sick") {
            fill(200, 0, 0, 20);
            stroke(200, 0, 0);
            ellipse(this.position.x, this.position.y, virus_size, virus_size);
            // stroke(255,255,255);
            //ellipse(this.position.x, this.position.y, virus_size * this.velocity.x,  virus_size * this.velocity.y);
            this.how_long_sick += 1;
            if (this.how_long_sick > max_sick) {
                this.health = "Immune";
                this.how_long_sick = 0;
            }

        }

        if (this.health === "Dying") {
            fill(255, 0, 0, 125);
            stroke(255, 0, 0);
            ellipse(this.position.x, this.position.y, virus_size, virus_size);
        }

        if (this.health === "Immune") {
            fill(0, 0, 125, 125);
            stroke(0, 0, 255);
            ellipse(this.position.x, this.position.y, virus_size, virus_size);
            // ellipse(this.position.x, this.position.y, virus_size * this.velocity.x, virus_size * this.velocity.y);
            this.how_long_immune += 1;
            if (this.how_long_immune > max_immune) {
                this.health = "Healthy";
                this.how_long_immune = 0;
            }
        }


    }

    // bounce against the walls
    borders() {
        if (this.position.x < this.r) this.velocity.mult(-1);
        if (this.position.y < this.r) this.velocity.mult(-1);
        if (this.position.x > width - this.r) this.velocity.mult(-1);
        if (this.position.y > height - this.r) this.velocity.mult(-1);
    }

    separate(viruses) {
        let desiredseparation = 35.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every person in the system, check if it's too close
        for (let i = 0; i < viruses.length; i++) {
            let d = p5.Vector.dist(this.position, viruses[i].position);
            // If people are close 
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, viruses[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        }

        if (count > 10) {
            this.health = "Sick";

        }

        if (count > 15) {
            this.health = "Dying";
            this.velocity = this.velocity.mult(1.2); //if dying give explosion effect by giving speed
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

    align(viruses) {
        let neighbordist = 10;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < viruses.length; i++) {
            let d = p5.Vector.dist(this.position, viruses[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(viruses[i].velocity);
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

    cohesion(viruses) {
        let neighbordist = 50;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < viruses.length; i++) {
            let d = p5.Vector.dist(this.position, viruses[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(viruses[i].position);
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
        let g = createVector(0.0, 0.0);
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