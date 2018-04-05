//Juriel Garcia
//Tic Tac toe game using minimax Algorithm

//------------------------------------- Variables & Contstants -----------------------------------
var origBoard = [];

var endGame, message;

var human;
var ai;

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

var selections = document.querySelectorAll('.selections');
var blurred = document.querySelectorAll('.blur');

var x = document.getElementById('x');
var o = document.getElementById('o');

//Initializing Function
function init() { //important for event listeners to allow the use to click on the buttons
    //Get Selection Input btns and add an event listener
    let inputX = document.getElementById('input-x');
    let inputO = document.getElementById('input-o');
    let retry = document.getElementById('retry-btn');

    let sMenu = document.getElementById('player-selection');

    retry.addEventListener('click', reset);

    inputO.addEventListener('click', function () {
        human = new player('o', document.getElementById('player2'));
        ai = new player('x', document.getElementById('player1'));
        sMenu.setAttribute('class', 'container fade-out');
        unBlur();
    });

    inputX.addEventListener('click', function () {
        human = new player('x', document.getElementById('player1'));
        ai = new player('o', document.getElementById('player2'));
        sMenu.setAttribute('class', 'container fade-out');
        unBlur();
    });

    startGame(); //Start the Game loop
}

function startGame() {
    //create an array with the size of 9 and assign it the the index of i
    for (var i = 0; i < 9; i++) {
        origBoard[i] = i;
    }

    //add an event listener to each selection
    for (selection of selections) {
        if (selection != null) {
            selection.firstChild.addEventListener('click', turnClick, false);
        }
    }
}

//when the player, or the computer make a selection
function turnClick(selection) {
    var parent = selection.target.parentElement; //select the parent element

    if (typeof origBoard[parent.id] == "number") {
        turn(parent, human.name); //pass in the human player's turn
        parent.removeChild(selection.target); //remove the input element

        //if the game has not been won OR it is not a tie let the computer make a selection based on the best spot 
        if (!checkWin(origBoard, human.name) && !checkTie()) {
            let cell = document.getElementById(bestPick());
            turn(cell, ai.name); //pass in the computer's turn
            cell.removeChild(cell.firstChild); //remove the input element
        }
    }
}

//update the board Array and real board with what the player or the computer has 
function turn(parent, player) {
    updateBoard(parent, player);

    let gameWon = checkWin(origBoard, player); //check if the player/computer has won
    //if the game has been won, Gameover and pass in the object of gameWon
    if (gameWon) {
        gameOver(gameWon);
    }
}

//check to see if someone has won
function checkWin(board, player) { //board: an array of numbers, player: players name
    //plays finds all the positions that the player/computer has played
    let plays = board.reduce(function (accum, element, index) {
        if (element === player) { // need to check of the player has selected this square on his turn
            return accum.concat(index);
        } else {
            return accum;
        }
    }, []);
    let gameWon = null;

    //
    for (var i = 0; i < winCombos.length; i++) { //winCombos[i]
        //Check if the plays array contains a similar value tp winCombos Array Are Equal
        if (winCombos[i].every(function (e) {
                return plays.indexOf(e) > -1;
            })) {
            gameWon = {
                index: i,
                player: player
            };
            break;
        }
    }
    return gameWon;
}

//returns the number of available spots
function availableSquares(board) {
    return board.filter(function (square) {
        return (typeof square) == 'number';
    });
}

//returns the id of the cell that is the best spot.
function bestPick() {
    return minimax(origBoard, ai.name).index;
}

//if the board is entirely filled, it returns a bool stating whether its a tie or not
function checkTie() {
    if (availableSquares(origBoard).length == 0) {
        for (var i = 0; i < selections.length; i++) {
            selections[i].removeEventListener('click', turnClick, false); //remove any remaining eventlisteners
        }
        updateScore("Tie");
        return true;
    } else {
        return false;
    }
}

//Minimax algorithm
function minimax(newboard, player) {
    //get the number of available spots left
    var available = availableSquares(newboard);

    if (checkWin(newboard, human.name)) {
        return {
            score: -10
        };
    } else if (checkWin(newboard, ai.name)) {
        return {
            score: 10
        };
    } else if (available.length === 0) {
        return {
            score: 0
        };
    }

    var moves = [];

    for (var i = 0; i < available.length; i++) {
        var move = {};
        move.index = newboard[available[i]];
        newboard[available[i]] = player;

        if (player == ai.name) {
            var result = minimax(newboard, human.name);
            move.score = result.score;
        } else {
            var result = minimax(newboard, ai.name);
            move.score = result.score;
        }

        newboard[available[i]] = move.index;

        moves.push(move);
    }

    var bestMove;

    //The ai is always on step ahead of the player, it checks this by testing if the score assigned to it is better than the score of the position before
    if (player == ai.name) {
        var bestScore = -1000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 1000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    //return the best position that the computer will make.
    return moves[bestMove];
}


//--------------------------------- Objects -------------------------------------------

function player(name, element) {
    this.name = name;
    this.score = 0;
    this.addScore = function () {
        this.score += 1;
    }
    this.element = element;
    this.update = function () {
        this.element.textContent = "Player " + this.name.toUpperCase() + " | " + this.score;
    }
}

//------------------------------- Utility Functions -----------------------------------


function updateScore(player) {
    //function changes any messages and etc
    let msg = document.getElementById('message');

    if (player == human.name) {
        msg.textContent = "Congrats, You have Won!"
        human.addScore();
    } else if (player == ai.name) {
        msg.textContent = "It seems that X's & O's Aren't Your Thing...";
        ai.addScore();
    } else {
        msg.textContent = "It's a tie";
    }

    human.update();
    ai.update();

    let gameEnd = document.getElementById('end-game');
    gameEnd.style.display = "block";
    gameEnd.setAttribute('class', 'container fade-in');
}

//The game is over, contains the object of game won;
function gameOver(gameWon) {

    for (s of selections) {
        s.removeChild(s.firstChild);
    }

    for (let index of winCombos[gameWon.index]) {
        createGraphic(document.getElementById(index), gameWon.player);
    }

    updateScore(gameWon.player);
}

function updateBoard(parent, player) {
    origBoard[parent.id] = player; //set the array to the players name;

    createGraphic(parent, player).setAttribute('class', 'fade-in');
}

function reset(parent, btn) {
    let gameEnd = document.getElementById('end-game');
    gameEnd.setAttribute('class', 'container fade-out');

    for (s of selections) {
        let input = document.createElement('input');
        input.setAttribute('type', 'button');

        if (s.firstChild != null) {
            s.firstChild.setAttribute('class', 'fade-out');
            window.setTimeout(removeGraphic(s.firstChild), 1000);
        }
        s.appendChild(input);
    }

    startGame();
}

function removeGraphic(graphic) {
    graphic.parentElement.removeChild(graphic);
}

function createGraphic(parent, player) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (player == "x") {
        svg.innerHTML = x.innerHTML;
    } else {
        svg.innerHTML = o.innerHTML;
    }
    parent.appendChild(svg);
    return svg;
}

function unBlur() {
    window.setTimeout(function () {
        for (b of blurred) {
            b.removeAttribute('class');
        }
    }, 500);
}

window.addEventListener('load', init());