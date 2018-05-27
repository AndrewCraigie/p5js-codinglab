const w = 800;
const h = 800;

let leftColor;
let topColor;
let frontColor;

let areaWidth = 500;
let areaDepth = 500;
let shapeCount = 21;

let increment = 0.1;
let increment2 = 0.0;
let colorIncrement = 0.01;

let bw = areaWidth / shapeCount;
let bd = areaDepth / shapeCount;
let bh = 40;
let minH = 40;
let maxH = 250;


function setup() {
  let canvas = createCanvas(800, 800, WEBGL);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');

  ortho(-width / 2, width / 2, -height / 2, height / 2, -2000, 2000);

  colorMode(HSB, 1.0, 1.0, 1.0, 1.0);
  leftColor = color(0.0, 1.0, 1.0, 1.0);
  topColor = color(0.33, 1.0, 1.0, 1.0);
  frontColor = color(0.666, 1.0, 1.0, 1.0);

}

function axisLights() {

  // X axis light
  //directionalLight(colorX, 0.25, -0.25, -0.25);

  // Y axis light
  //directionalLight(colorY, 0, 1, 0);

  // Z axis light
  //directionalLight(colorZ, -0.25, -0.25, -0.25);

  ambientLight(255);
}

function drawAxis() {
  // Draw X axis
  strokeWeight(2);
  stroke(255, 0, 0);
  line(350, 0, 0, -350, 0, 0);
  push();
  translate(350, 0, 0);
  rotateZ(-HALF_PI);
  noStroke();
  cone(10, 50, 10, true);
  pop();
  // Draw Y axis
  stroke(0, 0, 0);
  line(0, 350, 0, 0, -350, 0);
  push();
  translate(0, 350, 0);
  rotateY(-HALF_PI);
  noStroke();
  cone(10, 50, 10, true);
  pop();

  // Draw Z axis
  stroke(0, 0, 255);
  line(0, 0, 350, 0, 0, -350);
  push();
  translate(0, 0, 350);
  rotateX(HALF_PI);
  noStroke();
  cone(10, 50, 10, true);
  pop();
}

function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function drawShape(width, height, depth, x, y, z){

  let w = width;
  let h = height;
  let d = depth;

  // Left
  ambientMaterial(leftColor);
  push();
  translate(x - (w/2), y, z);
  rotateY(HALF_PI);
  plane(d, h);
  pop();

  // Front
  ambientMaterial(frontColor);
  push();
  translate(x, y, z + (d/2));
  plane(w, h);
  pop();

  // Top
  ambientMaterial(topColor);
  push();
  //translate(x, (-h/2) + y, 0);
  translate(x,  -h/2, z);
  rotateX(HALF_PI)
  plane(w, d);
  pop();

}

function distance(x0, y0, z0, x1, y1, z1){
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2) + Math.pow(z1 - z0, 2));
}


function draw() {
  background(0);

  camera(-w/2, -w/2, w/2, 0, 0, 0, 0, 1, 0);
  //drawAxis();
  //axisLights();

  ambientLight(255);

  noStroke();


  for (let z = -(floor(shapeCount / 2)); z < (floor(shapeCount / 2)) + 1; z++) {
    for (let x = -(floor(shapeCount / 2)); x < (floor(shapeCount / 2)) + 1; x++) {

      let locX = x * (areaWidth / shapeCount);
      let locY = 0;
      let locZ = z * (areaDepth / shapeCount);

      let shapeDistance = distance(0, 0, 0, locX, locY, locZ);
      let normDistance = mapRange(shapeDistance, 0, areaWidth, 0, 1);
      let d = normDistance * TWO_PI * 2;
      bh = mapRange(sin(d + increment), -1, 1, minH, maxH) ;

      leftColor = color(((normDistance + colorIncrement ) % 1), 1.0, 1.0, 1.0);
      topColor = color((((normDistance + colorIncrement) % 1 )), 1.0, 1.0, 1.0);
      frontColor = color((((normDistance + colorIncrement) % 1)), 1.0, 1.0, 1.0);

      drawShape(bw, bh, bd, locX, locY, locZ, leftColor, frontColor, topColor);

    }

  }

  increment += (TWO_PI / 60);
  colorIncrement += (1 / shapeCount) * 0.1;
  increment2 += 0.0001;

  //noLoop();
}
