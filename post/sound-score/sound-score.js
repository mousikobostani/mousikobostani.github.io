
let mySound, myPhrase, myPart;
let pattern = [1,0,1,0,1,0,2,2,2];

function preload() {
    soundFormats('mp3', 'ogg');
    mySound = loadSound('ntefi');
}

function setup() {
    let cnv = createCanvas(100, 100);
    cnv.mousePressed(playMyPart);
    background(220);
    text('tap to play', width/2, height/2);
    textAlign(CENTER, CENTER);

    myPhrase = new p5.Phrase('bbox', onEachStep, pattern);
    myPart = new p5.Part();
    myPart.addPhrase(myPhrase);
    myPart.setBPM(90);
    //myPart.loop();
}

function onEachStep(time, playbackRate) {
    mySound.rate(playbackRate);
    mySound.play(time);
}

function playMyPart() {
    userStartAudio();
    myPart.start();
}
