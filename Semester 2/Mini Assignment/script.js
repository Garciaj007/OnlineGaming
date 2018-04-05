//Juriel Garcia 
//Canvas sprite assignment

window.addEventListener('load', init);
window.addEventListener('keydown', keydownHandler);
window.addEventListener('keyup', keyupHandler);

var canvas, context, width, height;
var ramonaIdle, ramonaWalking, ramonaJumping, ramonaPunch, ramonaGuard, ramonaKick, ramonaTech;
var action = {
    idle: true
};
var intervalID;
var player;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    createSprite();
    intervalID = setInterval(draw, 16);
}

function createSprite(){
    ramonaIdle = new Sprite({
        URL: "Sprites/Ramona_Idle.png",
        width: 300,
        height: 70,
        ticksPerFrame: 4,
        numOfFrames: 6,
        loop: true
    });

    ramonaWalking = new Sprite({
        URL: "Sprites/Ramona_Walking.png",
        width: 300,
        height: 70,
        ticksPerFrame: 4,
        numOfFrames: 6,
        loop: true
    });

    ramonaJumping = new Sprite({
        URL: "Sprites/Ramona_Jumping.png",
        width: 480,
        height: 80,
        ticksPerFrame: 4,
        numOfFrames: 8,
    });

    ramonaPunch = new Sprite({
        URL: "Sprites/Ramona_Punch.png",
        width: 180,
        height: 65,
        ticksPerFrame: 8,
        numOfFrames: 3,
    });

    ramonaKick = new Sprite({
        URL: "Sprites/Ramona_Kick.png",
        width: 300,
        height: 70,
        ticksPerFrame: 8,
        numOfFrames: 5,
    });

    ramonaGuard = new Sprite({
        URL: "Sprites/Ramona_Guard.png",
        width: 250,
        height: 70,
        ticksPerFrame: 8,
        numOfFrames: 5,
    });

    ramonaTech = new Sprite({
        URL: "Sprites/Ramona_Tech.png",
        width: 1170,
        height: 80,
        ticksPerFrame: 8,
        numOfFrames: 13,
    });
}

function draw() {
    clearCanvas();

    if (action.jump) {
        ramonaJumping.update();
        ramonaJumping.render();

    }

    if (action.punch) {
        ramonaPunch.update();
        ramonaPunch.render();
    }

    if (action.idle) {
        ramonaIdle.update();
        ramonaIdle.draw();
        ramonaIdle.inverted();
    }

    if (action.moveLeft || action.moveRight) {
        ramonaWalking.update();
        ramonaWalking.render();
    }

    if (action.guard) {
        ramonaGuard.update();
        ramonaGuard.render();
    }

    if (action.kick) {
        ramonaKick.update();
        ramonaKick.render();
    }

    if (action.super) {
        ramonaTech.update();
        ramonaTech.render();
    }
}

//Classes
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
}

function Player() {
    this.position = new Vector(width / 2, height / 2);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.sprites = Sprites;
    this.currentSprite = new Sprite();
}

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

//Functional Prototypes

Sprite.prototype.update = function () {
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

Sprite.prototype.draw = function (position = new Vector(0, 0)) {
    //context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.drawImage(this.image, this.frameIndex * this.width / this.numOfFrames, 0, this.width / this.numOfFrames, this.height, position.x, position.y, this.width / this.numOfFrames, this.height);
}

Sprite.prototype.inverted = function (position = new Vector(0, 0)) {
    context.save();
    context.translate(position.x, position.y);
    context.scale(-1, 1);
    //context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.drawImage(this.image, this.frameIndex * this.width / this.numOfFrames, 0, this.width / this.numOfFrames, this.height, -(this.width / this.numOfFrames), 0, this.width / this.numOfFrames, this.height);
    context.restore();
}

Vector.prototype.add = function (v = Vector(0, 0)) {
    this.x += v.x;
    this.y += v.y;
}

Player.prototype.applyForce = function (force) {
    this.acceleration.add(force);
}

Player.prototype.update = function () {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
}
//General Functions

function clearCanvas() {
    context.clearRect(0, 0, width, height);
}

function keydownHandler() {
    if (event.defaultPrevented) {
        return;
    }

    switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
            action.idle = false;
            action.moveLeft = true;
            break;
        case "ArrowRight":
        case "KeyD":
            action.idle = false;
            action.moveRight = true;
            break;
        case "Space":
            action.idle = false;
            action.jump = true;
            break;
        case "ControlLeft":
            action.idle = false;
            action.guard = true;
            break;
        case "KeyF":
            action.idle = false;
            action.kick = true;
            break;
        case "KeyE":
            action.idle = false;
            action.punch = true;
            break;
        case "KeyQ":
            action.idle = false;
            action.super = true;
            break;
        default:
            action.idle = false;
            action.idle = true;
            break;
    }
}

function keyupHandler() {
    if (event.defaultPrevented) {
        return;
    }

    switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
            action.moveLeft = false;
            action.idle = true;
            break;
        case "ArrowRight":
        case "KeyD":
            action.moveRight = false;
            action.idle = true;
            break;
        case "Space":
            action.jump = false;
            action.idle = true;
            break;
        case "Control":
            action.guard = false;
            action.idle = true;
            break;
        case "KeyF":
            action.kick = false;
            action.idle = true;
            break;
        case "KeyE":
            action.punch = false;
            action.idle = true;
            break;
        case "KeyQ":
            action.super = false;
            action.idle = true;
            break;
        default:
            action.idle = true;
            break;
    }
}
