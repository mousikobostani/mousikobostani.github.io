
function setup() {
    createCanvas(500, 500);
    frameRate(30);
}

function draw() {
    fill(255,30);
    //rect(0,0,width,height);
    fill(0,50);
    ellipse(random(0,480), random(0,200),5,5);
}

function mousePressed() {
    
}
