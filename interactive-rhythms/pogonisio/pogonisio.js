let dumSound_1, tekSound_1, tek_2;
let myPart;
let dumPat_1 = [1,0,0,0,1,0,0,0];
let tekPat_1 = [0,0,1,1,0,0,1,0];
let tekPat_2 = [0,0,1,1,0,1,1,0];
let dumPhrase_1, tekPhrase_1, tekPhrase_2;
let butt1, butt2, butt3, butt4, butt5;
let sel;
let bpm = 40;

function preload() {
    soundFormats('mp3', 'ogg');
    dumSound_1 = loadSound('frameDrum');
    tekSound_1 = loadSound('gongaE');
}

function setup() {
    createCanvas(1200,800);
    background(255);
    
    textFont('Garamont');
    textStyle(BOLD);
    textSize(22);
    
    dumPhrase_1 = new p5.Phrase('dumPhrase_1', playDum_1, dumPat_1);
    tekPhrase_1 = new p5.Phrase('tekPhrase_1', playTek_1, tekPat_1);
    tekPhrase_2 = new p5.Phrase('tekPhrase_2', playTek_1, tekPat_2);
    myPart = new p5.Part();

    myPart.addPhrase(dumPhrase_1);
    myPart.addPhrase(tekPhrase_1);
    myPart.setBPM(40);

    button1 = createButton('play!'); button1.position(0, 10); button1.mousePressed(playKey);
    button2 = createButton('stop!'); button2.position(120, 10); button2.mousePressed(noLoopKey);
    button3 = createButton('bpm + 10'); button3.position(120, 150); button3.mousePressed(bpmKeyPlus10);
    button4 = createButton('bpm - 10'); button4.position(0, 150); button4.mousePressed(bpmKeyMinus10);
    button5 = createButton('bpm -  1'); button5.position(0, 110); button5.mousePressed(bpmKeyMinus);
    button6 = createButton('bpm +  1'); button6.position(120, 110); button6.mousePressed(bpmKeyPlus);

    sel = createSelect();
    sel.position(0, 230);
    sel.option('Πωγωνίσιο');
    sel.option('Παραλλαγή');
    sel.selected('Πωγωνίσιο');
    sel.changed(mySelectEvent);

}

function draw() {
    background(255);
    myPart.setBPM(bpm);
    text("bpm:", 10, 160);
    text(bpm, 100, 160);
//    text('Παίζει ' + sel.value(), 5, 500);
}
function playDum_1( time, playbackRate) { dumSound_1.rate(playbackRate); dumSound_1.play(time); }
function playTek_1( time, playbackRate) { tekSound_1.rate(playbackRate); tekSound_1.play(time); }
function playKey() { userStartAudio(); myPart.start(); myPart.loop(); }
function noLoopKey() { myPart.noLoop(); }
function bpmKeyPlus10() { bpm = bpm + 10; }
function bpmKeyMinus10() { bpm = bpm - 10; }
function bpmKeyPlus() { bpm = bpm + 1; }
function bpmKeyMinus() { bpm = bpm - 1; }

function mySelectEvent() {
    let item = sel.value();
    console.log(item);
    if (item == 'Παραλλαγή') {
        myPart.removePhrase('tekPhrase_1');
        myPart.addPhrase(tekPhrase_2);
    }
    if (item == 'Πωγωνίσιο') {
        myPart.removePhrase('tekPhrase_2');
        myPart.addPhrase(tekPhrase_1);
    }
}

