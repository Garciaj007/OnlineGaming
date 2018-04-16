//Juriel Garcia 
//Canvas sprite assignment

window.addEventListener('load', init);
window.addEventListener('keypress', keydownHandler);
window.addEventListener('keyup', keyupHandler);

const WIDTH = 800,
    HEIGHT = 600;
var canvas, ctx, intervalID, player, r_Anim, ramona;

var controller = {
    left: false,
    right: false,
    jump: false,
    punch: false,
    kick: false,
    tech: false,
    guard: false
}

var ramona = {
    ramonaIdle: new Sprite("Sprites/Ramona_Idle.png", 6, 4, true, new Vector(300, 70)),
    ramonaWalkingRight: new Sprite("Sprites/Ramona_Walking_Right.png", 6, 4, true, new Vector(300, 70)),
    ramonaWalkingLeft: new Sprite("Sprites/Ramona_Walking_Left.png", 6, 4, true, new Vector(300, 70)),
    ramonaJumpingRight: new Sprite("Sprites/Ramona_Jumping_Right.png", 8, 4, false, new Vector(480, 80)),
    ramonaJumpingLeft: new Sprite("Sprites/Ramona_Jumping_Left.png", 8, 4, false, new Vector(480, 80)),
    ramonaPunchRight: new Sprite("Sprites/Ramona_Punch_Right.png", 3, 8, false, new Vector(180, 65)),
    ramonaPunchLeft: new Sprite("Sprites/Ramona_Punch_Left.png", 3, 8, false, new Vector(180, 65)),
    ramonaKickRight: new Sprite("Sprites/Ramona_Kick_Right.png", 5, 8, false, new Vector(300, 70)),
    ramonaKickLeft: new Sprite("Sprites/Ramona_Kick_Left.png", 5, 8, false, new Vector(300, 70)),
    ramonaGuardRight: new Sprite("Sprites/Ramona_Guard_Right.png", 5, 8, false, new Vector(250, 70)),
    ramonaGuardLeft: new Sprite("Sprites/Ramona_Guard_Left.png", 5, 8, false, new Vector(250, 70)),
    ramonaTechRight: new Sprite("Sprites/Ramona_Tech.png", 13, 8, false, new Vector(1170, 80)),
    ramonaTechLeft: new Sprite("Sprites/Ramona_Tech.png", 13, 8, false, new Vector(1170, 80))
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    r_Anim = new Animation(ramona.ramonaIdle);
    player = new Player(r_Anim, new Vector(WIDTH / 2, HEIGHT / 2));

    intervalID = setInterval(Render, 16);
}

function Render() {
    clearCanvas();

    if (controller.left) {
        player.animation.set(ramona.ramonaWalkingLeft);
        player.velocity.x = -1;
    } else if (controller.right) {
        player.animation.set(ramona.ramonaWalkingRight);
        player.velocity.x = 1;
    } else {
        player.animation.set(ramona.ramonaIdle);
        player.velocity.x = 0;
    }

    player.animation.draw();
    player.animation.update();
    player.update();
}

//Classes
function Sprite(_url, _numFrames, _tickFrames, _loop, _size, _position) {
    this.URL = _url || " ";
    this.numOfFrames = _numFrames || 0;
    this.ticksPerFrame = _tickFrames || 0;
    this.loop = _loop || false;
    this.size = _size || new Vector();
    this.position = _position || new Vector();
}

function Animation(sprite) {
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = sprite.ticksPerFrame;
    this.numOfFrames = sprite.numOfFrames;
    this.loop = sprite.loop;
    this.size = sprite.size;
    this.position = sprite.position;
    this.image = new Image();
    this.image.src = sprite.URL;
}

function Player(animation, initialPosition) {
    if (arguments.length == 1) {
        this.animation = animation || null;
        this.animation.position = new Vector();
    } else if (arguments.length == 2) {
        this.animation = animation || null;
        this.animation.position = initialPosition || new Vector();
    }
    this.velocity = new Vector();
    this.acceleration = new Vector();
}

function Vector(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

//Functional Prototypes

Animation.prototype.update = function () {
    if (arguments.length == 0) {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numOfFrames - 1) {
                this.frameIndex += 1;
            } else if (this.loop) {
                this.frameIndex = 0;
            }
        }
    } else {
        if (arguments[0] < this.numOfFrames - 1) {
            this.frameIndex = arguments[0];
        }
    }
}

Animation.prototype.draw = function (position = new Vector(0, 0)) {
    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(this.image, this.frameIndex * this.size.x / this.numOfFrames, 0, this.size.x / this.numOfFrames, this.size.y, this.position.x, this.position.y, this.size.x / this.numOfFrames, this.size.y);
}

Animation.prototype.set = function (sprite) {
    this.ticksPerFrame = sprite.ticksPerFrame;
    this.numOfFrames = sprite.numOfFrames;
    this.loop = sprite.loop;
    this.size = sprite.size;
    this.image = new Image();
    this.image.src = sprite.URL;
}

Animation.prototype.reset = function () {
    this.frameIndex = 0;
    this.tickCount = 0;
}

Player.prototype.applyForce = function (force) {
    this.acceleration.add(force);
}

Player.prototype.update = function () {
    this.animation.position.add(this.velocity);
    this.velocity.add(this.acceleration);
}

Vector.prototype.add = function (v = Vector(0, 0)) {
    this.x += v.x;
    this.y += v.y;
}

Vector.prototype.set = function(x = 0, y = 0){
    this.x = x;
    this.y = y;
}

//Helper Functions

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function keydownHandler(e) {
    switch (e.code) {
        case "KeyA":
            controller.left = true;
            break;
        case "KeyD":
            controller.right = true;
            break;
    }
}

function keyupHandler(e) {
    switch (e.code) {
        case "KeyA":
            controller.left = false;
            break;
        case "KeyD":
            controller.right = false;
            break;
    }
}