var system;
var counter;

// AUDIO //
var input;

// IMAGE //
var img;


function setup() {
  createCanvas(800, 800);
  system = new ParticleSystem(createVector(width/10, height/4));

  // AUDIO // Create an Audio input
  input = new p5.AudioIn();
  input.start();
  // AUDIO //

  // IMAGE //
  img = loadImage("assets/loading.gif");  // Load the image
  // IMAGE //

  counter = 0;
}


function draw() {
  background(51);

  if (!(++counter % 8)) {

    var volume = input.getLevel();
    if (volume > 0.02) {
      system.addParticle(volume);
    }
  }
  
  system.run();
}


// A simple Particle class
var Particle = function(position, volume) {
  this.acceleration = createVector(0, 0.3);
  this.velocity = createVector(volume*50, -volume*20);
  this.position = position.copy();
  this.lifespan = 200.0;

};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  // IMAGE // draw the stuff:
  image(img, this.position.x, this.position.y, img.width, img.height);
  // IMAGE //

};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(volume) {
  this.particles.push(new Particle(this.origin, volume));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};