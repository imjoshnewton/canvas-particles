var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    },
    cCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    },
    colors = ["#30CCC1", "#709996", "#55FF94", "#FF95BB", "#CC30B5"],
    particle,
    particles = [],
    numParticles = 1100,
    gGravity = 0.5,
    gFriction = 0.75,
    lastCalledTime,
    fps,
    delta;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight -
  function (elmID) {
      var elmHeight, elmMargin, elm = document.getElementById(elmID);
      if(document.all) {// IE
          elmHeight = parseInt(elm.currentStyle.height);
          elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
      } else {// Mozilla
          elmHeight = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('height'));
          elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
      }
      return (elmHeight+elmMargin);
  }("footer");

cCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function Particle(x, y, radius, color1, color2, life, invincible, velx, vely, friction, gravity, emiter) {
  this.x = x;
  this.y = y;
  this.vx = velx || getRandomArbitrary(-3, 3);
  this.vy = vely || getRandomArbitrary(-3, 3);
  this.angle = 0;
  this.radius = radius * friction;
  this.color1 = color1;
  this.color2 = color2 || color1;
  this.alpha = 1;
  this.grad = c.createLinearGradient(
    -this.radius,
    this.radius / 2,
    this.radius,
    this.radius / 2
  );
  this.life = life;
  this.maxLife = life;
  this.invincible = invincible || false;
  this.friction = friction || gFriction;
  this.gravity = gravity || gGravity;
  this.isEmiter = emiter || false;

  this.grad.addColorStop(0, this.color1);
  this.grad.addColorStop(1, this.color2);

  this.update = function(angle) {

    this.x += this.vx;
    this.y += this.vy;
    if(!this.isEmiter) {
      this.vy += this.gravity;
    }

    if(this.x < (0+this.radius)) {
      this.vx = -this.vx;
      this.x = (0+this.radius)+1;
    }
    else if (this.x > (canvas.width-this.radius)) {
      this.vx = -this.vx;
      this.x = (canvas.width-this.radius);
    }

    if(this.y < (0+this.radius)) {
      this.vy = -this.vy;
      this.y = (0+this.radius)+1;
    }
    else if(this.y > (canvas.height-this.radius)) {
      if(!this.isEmiter) {
        this.vy = -this.vy*this.friction;
      }
      else { this.vy = -this.vy; }
      this.y = (canvas.height-(this.radius+this.gravity));
    }

    if(this.life <= 0 && !this.invincible) { this.die(particle.x, particle.y); }

    this.draw(angle);

    this.life--;
  };

  this.die = function(ox, oy) {
    this.life = this.maxLife;
    this.x = ox;
    this.y = oy;
    this.vx = getRandomArbitrary(-3, 3);
    this.vy = getRandomArbitrary(-3, 3);
  };

  this.draw = function(angle) {
    c.save();
    c.translate(this.x, this.y);
    //c.rotate(-Math.PI / 2);

    c.beginPath();
    c.arc(0, 0, this.radius, 0, angle, false);
    //c.lineWidth = smallDim * 0.29 > 65 ? smallDim * 0.29 / 5 : 15;
    //c.lineWidth = 1;
    //c.strokeStyle = this.grad;
    c.fillStyle = this.grad;
    c.globalAlpha = this.alpha * (this.life / this.maxLife);
    c.fill();
    //c.stroke();
    c.closePath();

    c.restore();
  };
}

function init() {
  //console.log(colors.length);
  particle = new Particle(cCenter.x, cCenter.y, 5, colors[getRandomInt(0, colors.length)], colors[getRandomInt(0, colors.length)], getRandomArbitrary(20, 250), true, getRandomArbitrary(20, 20), getRandomArbitrary(20, 20), 0, 0, true);

  for(var i = 0; i < numParticles; i++) {
    particles.push(new Particle(particle.x, particle.y, 15, colors[getRandomInt(0, colors.length)], colors[getRandomInt(0, colors.length)], getRandomArbitrary(120, 250), false, 0, 0, getRandomArbitrary(0.25, 0.75), 0, false));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'rgba(25, 25, 25, 0.2)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  //c.clearRect(0, 0, canvas.width, canvas.height);

  if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
  }
  delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;

  c.font = 'Verdana';
  c.fillStyle = "rgba(255, 255, 255, 0.5)";
  c.fillText('fps: ' + Math.ceil(fps), 15, 15);

  for(var i = 0; i < numParticles; i++) {
    particles[i].update(Math.PI * 2);
  }

  particle.update(Math.PI * 2);
}

// Get Things Going
init();
animate();

// Event Listeners
addEventListener("mousemove", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight -
    function (elmID) {
        var elmHeight, elmMargin, elm = document.getElementById(elmID);
        if(document.all) {// IE
            elmHeight = parseInt(elm.currentStyle.height);
            elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
        } else {// Mozilla
            elmHeight = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('height'));
            elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
        }
        return (elmHeight+elmMargin);
    }("footer");

  cCenter = {
    x: canvas.width / 2,
    y: canvas.height / 2
  };

  init();
});
