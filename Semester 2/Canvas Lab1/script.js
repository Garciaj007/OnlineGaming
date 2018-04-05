//Juriel Garcia
//A Bouncing Ball simulation with random colours, sizes, and velocities

window.addEventListener('load', init);

var canvas, context, start, stop, width, height, circles, intervalID;
const NUM_OF_CIRCLES = 40;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    start = document.getElementById('btnStart');
    stop = document.getElementById('btnStop');

    width = canvas.width;
    height = canvas.height;

    circles = [];
    for (var i = 0; i < NUM_OF_CIRCLES; i++) {
        circles[i] = new Circle();
    }

    start.addEventListener('click', onStart);
    stop.addEventListener('click', onStop);

    stop.style.display = "none";
}

//Classes

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function Circle() {
    this.radius = this.randomSize();
    this.position = new Vector(width / 2, height / 2);
    this.velocity = this.randomVelocity();
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
    this.color = 'rgb(' + this.randomColor() + ', ' + this.randomColor() + ', ' + this.randomColor() + ')';
}

//Functional Prototypes

Vector.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
}

Circle.prototype.randomColor = function () {
    return Math.floor(Math.random() * 255);
}

Circle.prototype.randomSize = function () {
    return Math.floor(Math.random() * 50) + 10;
}

Circle.prototype.randomVelocity = function () {
    return new Vector(randomRange(-6, 6), randomRange(-4, 4));
}

Circle.prototype.display = function () {
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, this.startAngle, this.endAngle, true);
    context.fill();
}

Circle.prototype.update = function () {
    this.position.add(this.velocity);
}

Circle.prototype.checkBounds = function () {
    if (this.position.x + this.radius > width || this.position.x - this.radius < 0) {
        this.velocity.x *= -1;
    }
    if (this.position.y + this.radius > height || this.position.y - this.radius < 0) {
        this.velocity.y *= -1;
    }
}

//general functions

function onStart() {
    stop.style.display = "inline";
    start.style.display = "none";
    intervalID = setInterval(draw, 10);
}

function onStop() {
    start.style.display = "inline";
    stop.style.display = "none";
    clearInterval(intervalID);
    reset();
}

function draw() {
    lateDraw();
    for (var circle of circles) {
        circle.update();
        circle.checkBounds();
        circle.display();
    }
}

function lateDraw() {
    context.fillStyle = '#2f4f4f50';
    context.fillRect(0, 0, 600, 400);
}

function reset(){
    clearCanvas();
    circles = [];
    for(var i = 0; i < NUM_OF_CIRCLES; i++){
        circles[i] = new Circle();
    }
}

function clearCanvas(){
    context.clearRect(0,0, width, height);
}

function randomRange(min, max){
    return Math.random() * (max - min) + min;
}