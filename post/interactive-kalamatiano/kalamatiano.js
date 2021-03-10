let dum, tek, myPart;
let dumPat = [1,0,0,1,0,1,0];
let tekPat = [0,1,1,0,1,0,1];

let button1, button2, button3;
let slider;

function preload() {
    createCanvas(100,100);
    soundFormats('mp3', 'ogg');
    dum = loadSound('frameDrum');
    tek = loadSound('gongaE');
}

function setup() {
    background(255);
    fill(0);
    
    let dumPhrase = new p5.Phrase('dum', playDum, dumPat);
    let tekPhrase = new p5.Phrase('tek', playTek, tekPat);
    myPart = new p5.Part();
    myPart.addPhrase(dumPhrase);
    myPart.addPhrase(tekPhrase);
    myPart.setBPM(40);

    button1 = createButton('play'); button1.position(0, 20); button1.mousePressed(playKey);
    button2 = createButton('stop'); button2.position(0, 50); button2.mousePressed(noLoopKey);
    button3 = createButton('bpm:'); button3.position(0, 80); button3.mousePressed(bpmKey);
    
    slider = createSlider(30, 180, 40, 1);
    slider.position(80, 85);
    slider.style('width', '80px');
}

function draw() { myPart.setBPM(slider.value()); }
function playDum( time, playbackRate) { dum.rate(playbackRate); dum.play(time); }
function playTek( time, playbackRate) { tek.rate(playbackRate); tek.play(time); }
function playKey() { userStartAudio(); myPart.start(); myPart.loop(); }
function noLoopKey() { myPart.noLoop(); }
function bpmKey() {  }
