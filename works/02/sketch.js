let fireworks = [];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    
    if (fireworks[i].isFinished()) {
      fireworks.splice(i, 1);
    }
  }
}

function mouseClicked() {
  fireworks = [];
  let firework = new Firework(width / 2, height, mouseX, mouseY, 10);
  fireworks.push(firework);
}


class Firework {
  constructor(x, y, targetX, targetY, radius) {
    this.position = createVector(x, y);
    this.velocity = createVector(targetX - x, targetY - y);
    this.velocity.normalize();
    this.velocity.mult(11); // パーティクルの速度
    this.gravity = createVector(0, 0.2);
    this.alpha = 255;
    this.radius = radius; // パーティクルの大きさを設定
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.velocity.add(this.gravity);
      this.position.add(this.velocity);

      // パーティクルが打ち上げる高さの条件を設定
      if (this.velocity.y >= 0) {
        this.explode(); // パーティクルが打ち上げる高さに達したら爆発させる
        this.alpha = 0; // パーティクルが消える
      }
    }

    for (let particle of this.particles) {
      particle.update();
    }

    // パーティクルの寿命が尽きたら削除する
    this.particles = this.particles.filter(particle => !particle.isFinished());
  }

  explode() {
    for (let i = 0; i < 30; i++) {
      let particle = new Particle(this.position.x, this.position.y);
      particle.applyForce(p5.Vector.random2D().mult(random(0.5, 2)));
      particle.lifespan = random(50, 250); // ランダムな寿命を設定する
      this.particles.push(particle);
    }
  }

  display() {
    stroke(255, this.alpha);

    if (!this.exploded) {
      point(this.position.x, this.position.y);
    }

    for (let particle of this.particles) {
      particle.display();
    }
  }

  isFinished() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2;

    // パーティクルが一定の高さに達したら消える
    if (this.lifespan <= 0) {
      this.lifespan = 0;
    }
  }

  display() {
    stroke(255, this.lifespan);
    point(this.position.x, this.position.y);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}
