//Juriel Garcia
//Canvas sprite assignment

window.addEventListener('load', init);
window.addEventListener('keyup', keyupHandler);

var MAP = [
    [1, 0, 0, 0, 2, 0, 0, 2],
    [0, 1, 0, 0, 2, 0, 0, 1],
    [0, 0, 2, 1, 0, 0, 0, 1],
    [0, 2, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 2, 0, 1],
    [0, 0, 2, 0, 0, 0, 0, 1],
    [3, 0, 0, 0, 2, 0, 0, 0],
];

const SIZE = 70;
const ITEMS = {
    LAND: 0,
    CAMP: 1,
    ENEMY: 2,
    HOME: 3,
    VILLAIN: 4
}

const ROWS = MAP.length;
const COLUMNS = MAP[0].length;

const WIDTH = ROWS * SIZE;
const HEIGHT = COLUMNS * SIZE;

var controller = {
    action: {
        fight: false,
        guard: false,
        flee: false
    },
    direction: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

var canvas, ctx, intervalID;
var countdown = 3;

var background, food, enemy;

var playerSprites = {
    ramonaIdle: new Sprite("Sprites/Ramona_Idle.png", 6, 4, true, new Vector(300, 70)),
    ramonaWalkingRight: new Sprite("Sprites/Ramona_Walking_Right.png", 6, 4, true, new Vector(300, 70)),
    ramonaWalkingLeft: new Sprite("Sprites/Ramona_Walking_Left.png", 6, 4, true, new Vector(300, 70))
}

var villianSprites = {
    Idle: new Sprite("Sprites/Gideon_Idle.png", 4, 4, true, new Vector(200, 70)),
    Attack1Left: new Sprite("Sprites/Gideon_Attack_Left.png", 8, 4, false, new Vector(1200, 100)),
    Attack1Right: new Sprite("Sprites/Gideon_Attack_Right.png", 8, 4, false, new Vector(1200, 100)),
    Attack2Left: new Sprite("Sprites/Gideon_Attack2_Left.png", 8, 4, false, new Vector(1400, 90)),
    Attack2Right: new Sprite("Sprites/Gideon_Attack2_Right.png", 8, 4, false, new Vector(1400, 90))
}

var player, enemy, villain;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    background = new Animation(new Sprite("Sprites/Map.jpg", 1, 0, false, new Vector(1040,840)));
    
    player = new Player(playerSprites.ramonaIdle);
    enemy = new Player();
    villain = new Player(villianSprites.Idle);
    
    moveVillian();
    
    intervalID = setInterval(Render, 16);
}

function Render() { // this a Never endling loop of hell..........
    clearCanvas();
    ctx.save();
    ctx.translate(-15, -20);
    background.update(1);
    background.draw();
    ctx.restore();

    for (var i = 0; i < COLUMNS; i++) {
        for (var j = 0; j < ROWS; j++) {
            switch (MAP[j][i]) {
                case ITEMS.CAMP:
                    ctx.fillStyle = "Blue"
                    ctx.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
                    break;
                case ITEMS.ENEMY:
                    ctx.fillStyle = "Red";
                    ctx.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
                    break;
                case ITEMS.HOME:
                    ctx.fillStyle = "Green";
                    ctx.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
            }
        }
    }
    
    player.animation.draw();
    player.animation.update();
    villain.animation.draw();
    villain.animation.update();
    
    player.animation.sprite.position.x = player.pos.row * SIZE;
    player.animation.sprite.position.y = player.pos.col * SIZE;
    villain.animation.sprite.position.x = villain.pos.row * SIZE;
    villain.animation.sprite.position.y = villain.pos.col * SIZE;
    
    if(countdown <= 0){
        moveVillian();
        checkSquare();
        countdown = 3;
    }

    if (controller.direction.left) {
        //move to the left if not out of bounds
        player.MoveLeft();
        controller.direction.left = false;
        checkSquare();
        countdown--;
    } else if (controller.direction.right) {
        //move th the right if not out of bounds
        player.MoveRight();
        controller.direction.right = false;
        checkSquare();
        countdown--;
    } else if (controller.direction.up) {
        //move up if not out of bounds
        player.MoveUp();
        controller.direction.up = false;
        checkSquare();
        countdown--;
    } else if (controller.direction.down) {
        //move down if in bounds
        player.MoveDown();
        checkSquare();
        controller.direction.down = false;
        countdown--;
    }
}

function moveVillian(){
    
    while(true){
        let r = randomRange(0, ROWS);
        let c = randomRange(0, COLUMNS);
        
        if(MAP[r][c] === 0){
            MAP[villain.pos.col][villain.pos.row] = 0;
            villain.MoveTo(c, r);
            MAP[r][c] = 4;
            break;
        } 
    }
}

//Returns a random Int in range
function randomRange(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function checkSquare(){
    switch(MAP[player.pos.col][player.pos.row]){
        case ITEMS.CAMP : this.food += 1;
            break;
        case ITEMS.HOME : console.log("Welcome Home...");
            break;
        case ITEMS.ENEMY : console.log("Engage Enemy?");
            break;
        case ITEMS.VILLAIN : console.log("Engage Villain?");
            break;
    }
}

//Classes
function Player(initSprite) {
    this.animation = new Animation(initSprite);
    this.pos = {
        row: 0,
        col: 0
    };
    this.gold = 0;
    this.food = 0;

    this.MoveLeft = function () {
        if (this.pos.row > 0) {
            this.pos.row--;
        }
    }
    this.MoveRight = function () {
        if (this.pos.row < ROWS - 1) {
            this.pos.row++;
        }
    }
    this.MoveUp = function () {
        if (this.pos.col > 0) {
            this.pos.col--;
        }
    }
    this.MoveDown = function () {
        if (this.pos.col < COLUMNS - 1) {
            this.pos.col++;
        }
    }
    this.MoveTo = function(_row, _col){
        this.pos.row = _row;
        this.pos.col = _col;
    }
}

//Url NumberofFrames, TicksPerFrames, loop, size(Vector), pos(Vector)
function Sprite(_url, _numFrames, _tickFrames, _loop, _size, _position) {
    this.URL = _url || " ";
    this.numOfFrames = _numFrames || 0;
    this.ticksPerFrame = _tickFrames || 0;
    this.loop = _loop || false;
    this.size = _size || new Vector();
    this.position = _position || new Vector();
}

function Animation(sprite = new Sprite()) {
    this.frameIndex = 0;
    this.tickCount = 0;
    this.sprite = sprite;

    this.image = new Image();
    this.image.src = sprite.URL;
}

function Vector(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

//Functional Prototypes
Sprite.prototype.left = function () {
    return this.position.x;
}
Sprite.prototype.right = function () {
    return this.position.x + this.size.width;
}
Sprite.prototype.top = function () {
    return this.position.y;
}
Sprite.prototype.bottom = function () {
    return this.y + this.size.y;
}

Animation.prototype.update = function () {
    if (arguments.length == 0) {
        this.tickCount += 1;
        if (this.tickCount > this.sprite.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.sprite.numOfFrames - 1) {
                this.frameIndex += 1;
            } else if (this.sprite.loop) {
                this.frameIndex = 0;
            } else {
                console.log("Oneshot done...");
            }
        }
    } else {
        if (arguments[0] < this.sprite.numOfFrames - 1) {
            this.frameIndex = arguments[0];
        }
    }
}

Animation.prototype.draw = function (position = new Vector()) {
    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(this.image, this.frameIndex * this.sprite.size.x / this.sprite.numOfFrames, 0, this.sprite.size.x / this.sprite.numOfFrames, this.sprite.size.y, this.sprite.position.x, this.sprite.position.y, this.sprite.size.x / this.sprite.numOfFrames, this.sprite.size.y);

}

Animation.prototype.set = function (_sprite = new Sprite) {
    this.sprite = _sprite;
    this.image.src = _sprite.URL;
}

Animation.prototype.reset = function () {
    this.frameIndex = 0;
    this.tickCount = 0;
}

Vector.prototype.set = function (x = 0, y = 0) {
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

function keyupHandler(e) {
    switch (e.code) {
        case "KeyA":
            controller.direction.left = true;
            break;
        case "KeyD":
            controller.direction.right = true;
            break;
        case "KeyW":
            controller.direction.up = true;
            break;
        case "KeyS":
            controller.direction.down = true;
    }
}
