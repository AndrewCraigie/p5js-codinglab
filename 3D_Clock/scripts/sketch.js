// Andrew Craigie
// p5js 3D Font Clock

let font3D;
let para;

let h;
let m;
let s;
let milli;


let margin = 70;
let colonSize = 30;
let hCS = colonSize * 0.5;
let charSize = 120;
let dispWidth = 0;
let hDW;
let spacings;
let left;

let pLightR = 100;
let pLightA = 0;
let rotAngle = 0;


let charList = {
  "0": "0030", //0
  "1": "0031", //1
  "2": "0032", //2
  "3": "0033", //3
  "4": "0034", //4
  "5": "0035", //5
  "6": "0036", //6
  "7": "0037", //7
  "8": "0038", //8
  "9": "0039", //9
  "colon": "003A", //:
  "P": "0050", //P
  "A": "0041", //A
  "M": "004D"  //M
};


let characters = {};

function scaleModel(model, scl) {
  for (let v of model.model['vertices']) {
    v.mult(scl);
  }
}

function centerModel(model, centers, scl) {

  let xcenter = (float(model.width) + (float(model.x) * 2)) * scl * centers[0];
  let ycenter = -float(model.height) * scl * centers[1];
  let zcenter = float(model.depth) * scl * centers[3];

  for (let v of model.model.vertices) {
    v.sub([xcenter, ycenter, zcenter]);

  }
}

function loadfont(fontdata) {

  font3D = fontdata.characters;

  for (let c in charList){
    let codePoint = charList[c];
    let c3D = font3D[codePoint];
    let modelfile = "models/export/" + c3D["model"];
    let model = loadModel(modelfile);
    c3D["model"] = model;
    c3D['displayWidth'] = charSize;
    characters[codePoint] = c3D;
  }

}

function getTimeNow(){
  let d = new Date();
  h = str(d.getHours()).padStart(2, "0");
  m = str(d.getMinutes()).padStart(2, "0");
  s = str(d.getSeconds()).padStart(2, "0");
  milli = d.getMilliseconds();

}

function preload() {
  var url = "models/export/latin.json";
  loadJSON(url, loadfont);
}

function setup() {
  let canv = createCanvas(600, 200, WEBGL);
  canv.parent('wrapper');

  for(let char3D in characters){
    scaleModel(characters[char3D], charSize);
    centerModel(characters[char3D], [0.5, 0.5, 0], charSize);
  }

  left = -(width * 0.5) + (dispWidth * 0.5);
  displayWidth = (width - (2 * margin)) / 7;
  hDW = displayWidth * 0.5;
  spacings = [
    -((5 * hDW) + (2 * hCS)),
    -((3 * hDW) + (2 * hCS)),
    -((2 * hDW) + (1 * hCS)),
    -(1 * hDW),
    (1 * hDW),
    ((2 * hDW) + (1 * hCS)),
    ((3 * hDW) + (2 * hCS)),
    ((5 * hDW) + (2 * hCS)),
  ];

}

function draw() {
  background(0);

  getTimeNow();

  directionalLight(255, 100, 0,  -0.5,  0.75,    0 );
  directionalLight(0,   100, 255, 0.5, -0.25, -0.2 );
  directionalLight(100, 100, 100,   0,     0, -0.75);

  let pLightX = pLightR * cos(pLightA);
  let pLightZ = pLightR * sin(pLightA);

  pointLight(255, 255, 255, pLightX, 50, pLightZ);
  pLightA += 0.005;

  let time = [h, m, s].join(":");

  for (let i = 0; i < time.length; i++) {

    let modX = spacings[i];

    let char = time[i];
    if (char == ":") {
      char = "colon";
    }
    let char3D = characters[charList[char]];
    let mod = char3D['model'];

    push();
    noStroke();
    specularMaterial(255, 200, 200);
    translate(modX , 0, 0);
    if(s == '00'){
      rotateY(TWO_PI * (milli / 1000));
    } else {
      rotateY(0);
    }
    model(mod);
    pop();

  }

  rotAngle += 0.01;

}
