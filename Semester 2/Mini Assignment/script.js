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
    ramonaJumpingRight: new Sprite("Sprites/Ramona_Jumping_Right.png", 8, 2, true, new Vector(480, 80)),
    ramonaJumpingLeft: new Sprite("Sprites/Ramona_Jumping_Left.png", 8, 2, true, new Vector(480, 80)),
    ramonaPunchRight: new Sprite("Sprites/Ramona_Punch_Right.png", 3, 12, true, new Vector(180, 65)),
    ramonaPunchLeft: new Sprite("Sprites/Ramona_Punch_Left.png", 3, 12, true, new Vector(180, 65)),
    ramonaKickRight: new Sprite("Sprites/Ramona_Kick_Right.png", 5, 8, true, new Vector(300, 70)),
    ramonaKickLeft: new Sprite("Sprites/Ramona_Kick_Left.png", 5, 8, true, new Vector(300, 70)),
    ramonaGuardRight: new Sprite("Sprites/Ramona_Guard_Right.png", 5, 12, true, new Vector(250, 70)),
    ramonaGuardLeft: new Sprite("Sprites/Ramona_Guard_Left.png", 5, 12, true, new Vector(250, 70)),
    ramonaTechRight: new Sprite("Sprites/Ramona_Tech_Right.png", 13, 8, true, new Vector(1170, 80)),
    ramonaTechLeft: new Sprite("Sprites/Ramona_Tech_Left.png", 13, 8, true, new Vector(1170, 80))
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    player = new Player(ramona.ramonaIdle);
    player.rigidbody.mass = 1.0;
    player.rigidbody.position.set(WIDTH / 2, HEIGHT / 2);

    intervalID = setInterval(Render, 16);
}

function Render() {
    clearCanvas();
    
    //New Action Script
    
    if(controller.direction.left){
        player.rigidbody.velocity.x = -1;
    } else if (controller.direction.right){
        player.rigidbody.velocity.x = 1;
    } else {
        player.rigidbody.velocity.x = 0;
    }
    
    if(controller.action.walk){
        if(player.rigidbody.velocity.x < 0){
            player.animation.set(ramona.ramonaWalkingLeft);
        } else {
            player.animation.set(ramona.ramonaWalkingRight);
        }
    } else if (controller.action.jump && player.animation.done !== true){
        if(player.rigidbody.velocity.x < 0){
            player.animation.set(ramona.ramonaJumpingLeft);
        } else {
            player.animation.set(ramona.ramonaJumpingRight);
        }
        if(player.rigidbody.position.y == HEIGHT - 100 && controller.action.jump){
            player.rigidbody.applyForce(new Vector(0, -20));
            //controller.action.jump = false;
        }  
    } else if (controller.action.tech && player.animation.done !== true){
        if(player.rigidbody.velocity.x < 0){
            player.animation.set(ramona.ramonaTechLeft);
        } else {
            player.animation.set(ramona.ramonaTechRight);
        }
    } else if (controller.action.guard){
        if(player.rigidbody.velocity.x < 0){
            player.animation.set(ramona.ramonaGuardLeft);
        } else {
            player.animation.set(ramona.ramonaGuardRight);
        }
    }else if (controller.action.punch){
        if(player.rigidbody.velocity.x < 0){
            player.animation.set(ramona.ramonaPunchLeft);
        } else {
            player.animation.set(ramona.ramonaPunchRight);
        }
    } else if(controller.action.kick){
        if(player.rigidbody.velocity.x < 0){
            player.animation.set(ramona.ramonaKickLeft);
        } else {
            player.animation.set(ramona.ramonaKickRight);
        }
    } else {
        player.animation.set(ramona.ramonaIdle);
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
    this.mass = 100.0;
    this.position = new Vector();
    this.velocity = new Vector();
    this.acceleration = new Vector();
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
    this.sprite = sprite;
    //this.done = false;
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
                this.frameIndex = 0;
            } else {
                console.log("Oneshot done...");
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
    //this.image = new Image();
    this.image.src = sprite.URL;
    
    this.done = false;
}

Animation.prototype.reset = function () {
    this.frameIndex = 0;
    this.tickCount = 0;
}

RigidBody.prototype.update = function(){
    this.applyForce(new Vector(0, 1));
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    
    if(this.velocity.x > 5){
        this.velocity.x = 5;
    }
    
    if(this.velocity.y > 5){
        this.velocity.y = 5;
    }
    
    if(this.position.y > HEIGHT - 100){
        this.position.y = HEIGHT - 100;
    }
    
    this.acceleration.set(0,0);
}

RigidBody.prototype.applyForce = function(_force = new Vector){
    this.acceleration.add(_force);
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

//Helper Functions

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function keydownHandler(e) {
    //controller.action.idle = false;
    switch (e.code) {
        case "KeyA":
            controller.direction.left = true;
            controller.action.walk = true;
            break;
        case "KeyD":
            controller.direction.right = true;
            controller.action.walk = true;
            break;
        case "KeyJ":
            controller.action.walk = false;
            controller.action.jump = true;
            break;
        case "KeyP":
            controller.action.walk = false;
            controller.action.punch = true;
            break;
        case "KeyC":
            controller.action.walk = false;
            controller.action.guard = true;
            break;
        case "KeyK":
            controller.action.walk = false;
            controller.action.kick = true;
            break;
        case "KeyE":
            controller.action.walk = false;
            controller.action.tech = true;
            break;
    }
}

function keyupHandler(e) {
    switch (e.code) {
        case "KeyA":
            controller.direction.left = false;
            controller.action.walk = false;
            break;
        case "KeyD":
            controller.direction.right = false;
            controller.action.walk = false;
            break;
        case "KeyJ": 
            controller.action.jump = false;
            break;
        case "KeyP":
            controller.action.punch = false;
            break;
        case "KeyK":
            controller.action.kick = false;
            break;
        case "KeyC":
            controller.action.guard = false;
            break;
        case "KeyE":
            controller.action.tech = false;
            break;
    }
    //acontroller.action.idle = true;
}