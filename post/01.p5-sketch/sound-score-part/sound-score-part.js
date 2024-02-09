let dum, tek, myPart;
let dumPat = [1,0,0,0,1,0,0,0];
let tekPat = [0,0,1,1,0,0,1,0];

let button1, button2, button3, button4, button5, button6;
let slider, bpm = 40;

function preload() {
   
    soundFormats('mp3', 'ogg');
    dum = loadSound('frameDrum');
    tek = loadSound('gongaE');
}

function setup() {
    createCanvas(1200,800);
    
    textSize(36);
    fill(0);
    //text("bpm", 0, 0);
    
    let dumPhrase = new p5.Phrase('dum', playDum, dumPat);
    let tekPhrase = new p5.Phrase('tek', playTek, tekPat);
    myPart = new p5.Part();
    myPart.addPhrase(dumPhrase);
    myPart.addPhrase(tekPhrase);
    myPart.setBPM(40);

    button1 = createButton('play!'); button1.position(0, 20); button1.mousePressed(playKey);
    button2 = createButton('stop!'); button2.position(120, 20); button2.mousePressed(noLoopKey);
    button3 = createButton('bpm + 10'); button3.position(120, 80); button3.mousePressed(bpmKeyPlus10);
    button4 = createButton('bpm - 10'); button4.position(0, 80); button4.mousePressed(bpmKeyMinus10);
    button5 = createButton('bpm -  1'); button5.position(0, 120); button5.mousePressed(bpmKeyMinus);
    button6 = createButton('bpm +   1'); button6.position(120, 120); button6.mousePressed(bpmKeyPlus);
    
    //slider = createSlider(30, 180, 40, 1);
    //slider.position(200, 85);
    //slider.style('width', '80px');
}

function draw() {
    background(255);
    //bpm = slider.value();
    myPart.setBPM(bpm);
    //noFill();
    stroke(0,255);
    //rect(400, 180, 520, 220);
    text("bpm:", 420, 200);
    text(bpm, 520, 200);
}
function playDum( time, playbackRate) { dum.rate(playbackRate); dum.play(time); }
function playTek( time, playbackRate) { tek.rate(playbackRate); tek.play(time); }
function playKey() { userStartAudio(); myPart.start(); myPart.loop(); }
function noLoopKey() { myPart.noLoop(); }
function bpmKeyPlus10() { bpm = bpm + 10; }
function bpmKeyMinus10() { bpm = bpm - 10; }
function bpmKeyPlus() { bpm = bpm + 1; }
function bpmKeyMinus() { bpm = bpm - 1; }
