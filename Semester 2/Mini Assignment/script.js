//Juriel Garcia 
//Canvas sprite assignment

window.addEventListener('load', init);
window.addEventListener('keypress', keydownHandler);
window.addEventListener('keyup', keyupHandler);

const WIDTH = 800,
    HEIGHT = 600;
var canvas, ctx, intervalID, player, r_Anim, ramona;

var controller = {
    action: {
        idle: true,
        walk: false,
        jump: false,
        punch: false,
        kick: false,
        tech: false,
        guard: false,
    },
    direction:{
        left: false,
        right: false
    }
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
    ramonaTechRight: new Sprite("Sprites/Ramona_Tech_Right.png", 13, 8, false, new Vector(1170, 80)),
    ramonaTechLeft: new Sprite("Sprites/Ramona_Tech_Left.png", 13, 8, false, new Vector(1170, 80))
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    player = new Player(ramona.ramonaIdle);
    player.rigidbody.gravity.set(0, 0.001);
    player.rigidbody.mass = 1.0;
    player.rigidbody.position.set(WIDTH / 2, HEIGHT / 2);

    intervalID = setInterval(Render, 16);
}

function Render() {
    clearCanvas();
    
    if(controller.direction.left){
        player.rigidbody.velocity.x = -1;
        if(controller.action.walk){
            player.animation.set(ramona.ramonaWalkingLeft);
        }
        if(controller.action.tech){
            console.log("tech used");
            player.animation.set(ramona.ramonaTechLeft);
        }
    } else if(controller.direction.right){
        player.rigidbody.velocity.x = 1;
        if(controller.action.walk){
            player.animation.set(ramona.ramonaWalkingRight);
        }
        if(controller.action.tech){
            player.animation.set(ramona.ramonaTechRight);
        }
    } else {
        player.rigidbody.velocity.x = 0;
        if(controller.action.idle){
            player.animation.set(ramona.ramonaIdle);
        }
    }
    
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

function RigidBody(){
    this.mass = 0.0;
    this.position = new Vector();
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.gravity = new Vector(0, 9.8);
}

function Animation(sprite = new Sprite()){
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

function Player(initSprite) {
        this.animation = new Animation(initSprite);
        this.rigidbody = new RigidBody();
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
                console.log("Oneshot done...");
                this.frameIndex = 0;
            }
        }
    } else {
        if (arguments[0] < this.numOfFrames - 1) {
            this.frameIndex = arguments[0];
        }
    }
}

Animation.prototype.draw = function (position = new Vector()) {
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

RigidBody.prototype.update = function(){
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.add(this.gravity);
    
    if(this.position.y > HEIGHT - 100){
        this.velocity.y = 0;
    }
}

RigidBody.prototype.applyForce = function(force = new Vector()){
    this.acceleration.add(force.div(this.mass));
}

Player.prototype.update = function () {
    this.animation.position = this.rigidbody.position;
    this.animation.draw();
    this.animation.update();
    this.rigidbody.update();
}

Vector.prototype.set = function(x = 0, y = 0){
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function (v = new Vector()) {
    this.x += v.x;
    this.y += v.y;
}

Vector.prototype.div = function(d){
    this.x = this.x / d;
    this.y = this.y / d;
}

//Helper Functions

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function keydownHandler(e) {
    controller.action.idle = false;
    switch (e.code) {
        case "KeyA":
            controller.direction.left = true;
            controller.action.walk = true;
            break;
        case "KeyD":
            controller.direction.right = true;
            controller.action.walk = true;
            break;
        case "Space":
            controller.action.walk = false;
            controller.action.jump = true;
            break;
        case "KeyQ":
            controller.action.walk = false;
            controller.action.tech = true;
            break;
    }
}

function keyupHandler(e) {
    controller.action.idle = true;
    switch (e.code) {
        case "KeyA":
            controller.direction.left = false;
            controller.action.walk = false;
            break;
        case "KeyD":
            controller.direction.right = false;
            controller.action.walk = false;
            break;
        case "Space": 
            controller.action.jump = false;
            break;
    }
}