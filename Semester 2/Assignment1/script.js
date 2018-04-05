//Questions to ask prof
//1.how to use API Prefixes, and the fullscreen API.
//2.2D Arrays for sprites and switching sprites
//3.How to get started with CDN hosting
//4. HTTP, Http headers, & CORS
//Also ask for Promises

window.addEventListener('load', init);

var context;
var background;

const WIDTH = 1260,
    HEIGHT = 720;

function init() {
    let canvas = document.getElementById("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context = canvas.getContext("2d");

    createSprite();
    setInterval(draw, 100);
}

function createSprite() {
    background = new Sprite({
        URL: "Sprites/CityTorontoColor.png",
        width: 1920,
        height: 1080,
        numOfFrames: 1,
        loop: false,
        scale: 0.67
    });
}

function draw() {
    clearCanvas();
    update();
    render();
    
    createGrid();
}

function createGrid() {
    context.save();
    context.translate(WIDTH / 4, HEIGHT / 4);
    context.strokeStyle = 'Black';
    context.lineWidth = 4;
    for (var j = 0; j < 6; j++) {
        for (var i = 0; i < 6; i++) {
            context.beginPath();
            context.setLineDash([4, 12]);
            context.moveTo(i * 100, j * 100);
            context.lineTo(i * 100 + 100, j * 100);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.setLineDash([4, 12]);
            context.moveTo(i * 100, j * 100);
            context.lineTo(i * 100, j * 100 - 100);
            context.closePath();
            context.stroke();
        }
    }

    context.beginPath();
    context.setLineDash([4, 12]);
    context.moveTo(600, -100);
    context.lineTo(600, 500);
    context.closePath();
    context.stroke();
    context.restore();
}

function update() {

}

function render() {
    background.draw();
}

function clearCanvas() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
}

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function Sprite(SpriteContext) {
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = SpriteContext.ticksPerFrame || 0;
    this.numOfFrames = SpriteContext.numOfFrames || 0;
    this.loop = SpriteContext.loop || false;
    this.width = SpriteContext.width || 0;
    this.height = SpriteContext.height || 0;
    this.image = new Image();
    this.image.src = SpriteContext.URL || null;
    this.scale = SpriteContext.scale || 1;
}

Vector.prototype.add = function (v = Vector(0, 0)) {
    this.x += v.x;
    this.y += v.y;
}

Sprite.prototype.update = function () {
    if (this.ticksPerFrame != 0) {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numOfFrames - 1) {
                this.frameIndex += 1;
            } else if (this.loop) {
                this.frameIndex = 0;
            }
        }
    }
}

Sprite.prototype.draw = function (position = new Vector(0, 0)) {
    //context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.drawImage(this.image, this.frameIndex * this.width / this.numOfFrames, 0, this.width / this.numOfFrames, this.height, position.x, position.y, (this.width / this.numOfFrames) * this.scale, this.height * this.scale);
}

Sprite.prototype.inverted = function (position = new Vector(0, 0)) {
    context.save();
    context.translate(position.x, position.y);
    context.scale(-1, 1);
    //context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.drawImage(this.image, this.frameIndex * this.width / this.numOfFrames, 0, this.width / this.numOfFrames, this.height, -(this.width / this.numOfFrames), 0, this.width / this.numOfFrames, this.height);
    context.restore();
}
