// Andrew Craigie
// p5js Easing 3D Font Clock

let font3D;
let para;

let milli;

let strHours = "00";
let strMinutes = "00";
let strSeconds = "00";

let numHours = 0;
let numMinutes = 0;
let numSeconds = 0;

let margin = 20;
let colonSize = 30;
let hCS = colonSize * 0.5;
let charSize = 140;
let dispWidth = 0;
let hDW;
let spacings;
let left;

let digitsRadius = 250;

let pLightR = 100;
let pLightA = 0;
let rotAngle = 0;
let rotSpacing = Math.PI * 2 / 10;

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
  "M": "004D" //M
};

let characters = {};

let curDigits = [0, 0, 0, 0, 0, 0, 0];
let digitTarget = [];

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

  for (let c in charList) {
    let codePoint = charList[c];
    let c3D = font3D[codePoint];
    let modelfile = "models/export/" + c3D["model"];
    let model = loadModel(modelfile);
    c3D["model"] = model;
    c3D['displayWidth'] = charSize;
    characters[codePoint] = c3D;
  }

}

function getTimeNow() {

  let debugging = false;
  let d = new Date();

  if (debugging) {
    let fm = 29;
    let fh = 16;
    let fakeMins = 1000*60*fm;
    let fakeHours = 1000*60*60*fh;
    let timeOffset = fakeMins + fakeHours;
    let timeObject = new Date();
    timeObject = new Date(timeObject .getTime() + timeOffset);
    d = timeObject;
  }

  numHours = d.getHours();
  numMinutes = d.getMinutes();
  numSeconds = d.getSeconds();
  strHours = str(numHours).padStart(2, "0");
  strMinutes = str(numMinutes).padStart(2, "0");
  strSeconds = str(numSeconds).padStart(2, "0");
  milli = d.getMilliseconds();

  curDigits[0] = floor(numHours / 10) % 10;
  curDigits[1] = numHours % 10;
  curDigits[2] = 0;
  curDigits[3] = floor(numMinutes / 10) % 10;
  curDigits[4] = numMinutes % 10;
  curDigits[5] = 0;
  curDigits[6] = floor(numSeconds / 10) % 10;
  curDigits[7] = numSeconds % 10;

  digitTarget[0] = curDigits[0] * rotSpacing;
  digitTarget[1] = curDigits[1] * rotSpacing;
  digitTarget[2] = 0; // Colon
  digitTarget[3] = curDigits[3] * rotSpacing;
  digitTarget[4] = curDigits[4] * rotSpacing;
  digitTarget[5] = 0; // Colon
  digitTarget[6] = curDigits[6] * rotSpacing;
  digitTarget[7] = curDigits[7] * rotSpacing;

}

function lastSecond(){
  return (curDigits[6] + curDigits[7] == 14);
}

function lastMinute(){
  return (curDigits[3] + curDigits[4] == 14);
}

function isTwentyThreeHour(){
  return (curDigits[0] == 2) && (curDigits[1] == 3);
}

function easeFunction(){
  return Ease.Elastic.Out(milli / 1000);
}

function easeAmount(num){
  return rotSpacing * easeFunction() * num;
}

function preload() {
  var url = "models/export/latin.json";
  loadJSON(url, loadfont);
}

function setSizing(){
  charSize = windowWidth * 0.23;
  digitsRadius = windowHeight * 0.65;

  for (let char3D in characters) {
    scaleModel(characters[char3D], charSize);
    centerModel(characters[char3D], [0.5, 0.5, 0], charSize);
  }

  left = -(width * 0.5) + (dispWidth * 0.5);
  displayWidth = (width - (2 * margin)) / 7;
  hDW = displayWidth * 0.5;
  spacings = [-((5 * hDW) + (2 * hCS)), -((3 * hDW) + (2 * hCS)), -((2 * hDW) + (1 * hCS)), -(1 * hDW),
    (1 * hDW),
    ((2 * hDW) + (1 * hCS)),
    ((3 * hDW) + (2 * hCS)),
    ((5 * hDW) + (2 * hCS)),
  ];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setSizing();
}


function setup() {
  let canv = createCanvas(windowWidth, windowHeight, WEBGL);
  setSizing();
}

function draw() {
  background(0);

  getTimeNow();

  pointLight(255, 100, 0, 0, -50, 1000);
  pointLight(255, 100, 0, 700, 0, 1000);
  pointLight(255, 100, 0, -700, 0, 1000);

  pointLight(80, 235, 225, 0, -100, -800);

  let time = [strHours, strMinutes, strSeconds].join(":");

  for (let i = 0; i < time.length; i++) {

    let modId;
    let mod;
    let rotX;

    let rotStart = digitTarget[i];

    // Colons
    if (time[i] == ":") {
      modId = charList['colon'];
      mod = characters[modId]['model'];
      push();
      noStroke();
      specularMaterial(255, 255, 255);
      translate(0, 0, -digitsRadius);
      translate(spacings[i], 0, digitsRadius);
      model(mod);
      pop();

    } else {

      rotStart = digitTarget[i];  // Angle to start drawing loop of digits based on current time

      if (i == 0){
        if (curDigits[1] == 9 && lastMinute() && lastSecond()) {
            rotStart = digitTarget[0] + easeAmount(1);
        }
        if(isTwentyThreeHour() && lastMinute() && lastSecond()){
            rotStart = digitTarget[0] + easeAmount(8);
        }
      }

      if(i == 1){
        if (lastMinute() && lastSecond()) {
          if(isTwentyThreeHour()){ // Transition from 23:59:59 to 00:00:00
            rotStart = digitTarget[i] + easeAmount(7);
          } else {
            rotStart = digitTarget[i] + easeAmount(1);
          }
        }
      }

      if (i == 3){
        if ((curDigits[4] == 9) && lastSecond()) {
          if (curDigits[3] == 5) {
            rotStart = digitTarget[3] + easeAmount(5);
          } else {
            rotStart = digitTarget[3] + easeAmount(1);
          }
        }
      }

      if(i == 4){
        if (lastSecond()) {
            rotStart = digitTarget[i] + easeAmount(1);
        }
      }

      if (i == 6){
        if (curDigits[7] == 9) {
          if (curDigits[6] == 5) {
            rotStart = digitTarget[6] + easeAmount(5);
          } else {
            rotStart = digitTarget[6] + easeAmount(1);
          }
        }
      }

      if (i == 7) {
        rotStart = digitTarget[i] + easeAmount(1);
      }

      // Digits
      for (let j = 0; j < 10; j++) {

        modId = charList[str(j)];
        mod = characters[modId]['model'];

        push();
        noStroke();
        translate(0, 0, -digitsRadius);
        let rotation = -rotStart + (j * rotSpacing);
        rotateX(rotation);
        translate(spacings[i], 0, digitsRadius);
        // Set rear digits material to ambient
        if(cos(rotation) > 0){
          specularMaterial(255, 255, 255);
        } else {
          ambientMaterial(80, 130, 170);
        }
        model(mod);
        pop();
      }
    }
  }

}
