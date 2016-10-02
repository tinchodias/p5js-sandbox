var system;
var counter;
var click;

// AUDIO //
var input;

// IMAGES //
var imageNames = ["assets/asterisk.png", "assets/triangle.png", "assets/square.png", "assets/cloud.png", "assets/star.png", "assets/mess.png", "assets/monster.png"];
var currentImage;

function setup() {
  createCanvas(1024, 800);
  system = new ParticleSystem(createVector(width/10, height/4));

  // AUDIO // Create an Audio input
  input = new p5.AudioIn();
  input.start();
  // AUDIO //

  // IMAGES //
  currentImage = 0;
  images = imageNames.map(function(each) {
    return loadImage(each);
  }); 
  // IMAGES //

  counter = 0;
  click = false;
}



function draw() {
  background(51);

  if (!(++counter % 7)) {

    // Simulate volume on click
    var volume = click? 0.3 : input.getLevel();
    
    if (enoughMicLevel(volume)) {
      system.addParticle(volume);
    }
  }
  
  system.run();
}



function enoughMicLevel(volume) {
    return volume > 0.05;
}
function mousePressed() {
  click = true;
}
function mouseReleased() {
  click = false;
}




// A simple Particle class
var Particle = function(position, volume, image) {
  this.acceleration = createVector(0, 0.5);
  this.velocity = createVector(volume*50, -volume*20);
  this.position = position.copy();
  this.lifespan = 200.0;
  this.image = image;
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
  // IMAGE //
  image(this.image, this.position.x, this.position.y);
};

// Is the particle still useful?
Particle.prototype.isDead = function() {
  return this.lifespan < 0;
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(volume) {
  // IMAGES //
  if (++currentImage>=images.length) { currentImage = 0 };
  this.particles.push(new Particle(this.origin, volume, images[currentImage]));
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