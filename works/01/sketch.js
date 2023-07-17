let particles = [];
let interval = 10;
let lastSpawnTime = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  
  // 現在の時刻が最後の粒子生成時刻から一定の間隔を超えた場合、新しい粒子を生成する
  if (millis() - lastSpawnTime > interval) {
    particles.push(new Particle(width / 2, height / 2)); // 新しい粒子を生成し、配列に追加する
    lastSpawnTime = millis(); // 最後の粒子生成時刻を更新する
  }
  
  // すべての粒子を更新して描画する
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.draw();
    
    // 壁に反射する
    if (particle.position.x < 0 || particle.position.x > width) {
      particle.velocity.x *= -1;
    }
    if (particle.position.y < 0 || particle.position.y > height) {
      particle.velocity.y *= -1;
    }
    
    // 画面外に出た粒子は配列から削除する
    if (particle.isOffscreen()) {
      particles.splice(i, 1);
    }
  }
}

// 粒子クラス
class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(1, 3));
    this.radius = random(2, 8);
    this.color = color(random(255), random(255), random(255));
  }
  
  update() {
    this.position.add(this.velocity);
  }
  
  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  }
  
  isOffscreen() {
    return (
      this.position.x < -this.radius * 2 || 
      this.position.x > width + this.radius * 2 || 
      this.position.y < -this.radius * 2 || 
      this.position.y > height + this.radius * 2
    );
  }
}
