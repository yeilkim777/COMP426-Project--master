import { levelArray } from "./getLevel.js"
import { boardGet, boardSet } from "./backend-firestore.js"
import { centralDataBase } from "../firebaseCentral.js"

let x = 13;
let y = 13; 
let board = [];

let userNameWithoutGmail = localStorage.getItem('user');

let player = {
    //name: "player.name@".substring(0,firebaseUser.email.indexOf('@')),
    name: userNameWithoutGmail.substring(0, userNameWithoutGmail.indexOf("@")),
    x: 0,
    y: 0,
    moves: 0,
    time: 0,
    won: false, // If true, stop the game, make something pop up either going to next level or restarting the maze
    level: 1 // starting level
}

let minMove = 3;

let speed = 10; // speed of animation

let doneMove = true; // important for one move at a time

let firstMove = true; //variable for stopwatch
let stopWatch; // same

let timeScoreBoard = [] //contains player object {player: name, time: 000}
let moveScoreBoard = [] //contains player object {player: name, moves: 000}
//There is a dummy object in each array
//can add in rank element or something, but you must add it to all the dummy objects

$(function () {
    loadGame();
})
let cansavetime = false;
let cansavemove = false;

let myTime = null;

export async function loadGame() {
    const $root = $('#root')
    console.log($root.data('user'))
    timeScoreBoard = await getTimeBoard(player.level);
    moveScoreBoard = await getMoveBoard(player.level);
    let timetable = document.createElement('table')
    timetable.id = 'times'
    let movetable = document.createElement('table')
    movetable.id = 'moves'

    let leftDiv = document.createElement('div')
    leftDiv.id = 'leftDiv'
    leftDiv.style = 'display:flex; flex-direction: column;'
    leftDiv.innerHTML = (`<h1 style=''>TIME</h1>`)
    leftDiv.append(timetable)

    let lefterDiv = document.createElement('div')
    lefterDiv.id = 'lefterDiv'
    lefterDiv.style = 'margin-top:20px;height:350px;font-size: 15px;background-color: crimson;display:flex; flex-direction: column;align-items: center; justify-content: flex-start'
    lefterDiv.innerHTML = (`<div id='lefterDivButtons' style='width:250px;height:70px;display:flex; justify-content: space-around; align-items:center'><button id='LogOut' style='height: 60px; width: 80px;background-color: maroon; box-shadow: 0 6px #999;border-radius:32px; border:solid; color:white'>Log Out</button><button id='flush' style ='height:60px;width:80px;background-color: black; box-shadow: 0 6px #999;border-radius:32px; border:solid; color:white'>Delete Data</button></div>`)
    lefterDiv.innerHTML += (`<h4 id = "searchtext" style="height: 30px;align-self: flex-start; margin: 5px; margin-left: 30px;font-size: 20px; color: white;font-family: Verdana; margin-left: 15px">Search:</h4>`)
    lefterDiv.innerHTML += (`<form><input type='text' id='search' placeholder='search here'>`)
    lefterDiv.innerHTML += (`<div style='height: 170px; width:180px;margin-top: 10px;color-white; background-color: coral'id='searchResults'></div>`)
    leftDiv.append(lefterDiv)

    $root.append(leftDiv)   


    let midDiv = document.createElement('div')
    midDiv.id = 'midDiv'
    midDiv.style = 'display:flex; flex-direction: column; align-items: center; width: 770px  '
    let midDivTop = document.createElement('div')
    midDivTop.id = 'midDivTop'
    midDivTop.style = 'display:flex; width: 790px; justify-content: space-between'
    midDivTop.innerHTML = (`<button style='margin-bottom: 15px;box-shadow: 0 6px #999;border-radius:32px; border:solid;background-color: royalblue;color:white;font-family: Lucida Sans Unicode' id = 'time'>Save Time (T)</button>`)
    midDivTop.innerHTML += (`<div style='margin-right: 20px;margin-left:20px; width: 180px'id = 'timeboard'><h1>Time: ${player.time}</h1></div>`)
    midDivTop.innerHTML += (`<div id="currlevel"><h1 style='text-align: center;font-weight: bold;  font-family: Georgia:'> Level: ${player.level}</h1></div>`)
    midDivTop.innerHTML += (`<div style = 'text-align: center;margin-right: 20px;margin-left:20px; width: 150px' id = 'moveboard'><h1>Moves: ${player.moves}</h1></div>`)
    midDivTop.innerHTML += (`<button style='box-shadow: 0 6px #999;    border-radius:32px; border:solid;background-color: red;color:white;font-family: Lucida Sans Unicode'id = 'move'>Save Move (M)</button>`)
    midDiv.append(midDivTop)
    midDiv.append(levelBuild(player.level))
    let buttonPanel = document.createElement('div')
    buttonPanel.id = 'buttonPanel'
    buttonPanel.style = 'margin-top: 10px;display:flex; justify-content: space-between; '
    buttonPanel.innerHTML = `<button style='box-shadow: 0 6px #999;border-radius:32px;background-color: purple;color:white;font-family: Lucida Sans Unicode' id = 'previous'>Previous (P)</button>
                            <button style='box-shadow: 0 6px #999;border-radius:32px;background-color: darkorange;color:white;font-family: Lucida Sans Unicode' id = 'reset'>Reset (R)</button>
                            <button style='box-shadow: 0 6px #999;border-radius:32px;background-color: green;color:white;font-family: Lucida Sans Unicode'id = 'next'>Next (N)</button>`

    midDiv.append(buttonPanel)
    $root.append(midDiv)

    let rightDiv = document.createElement('div')
    rightDiv.id = 'rightDiv'
    rightDiv.style ='display:flex; flex-direction: column;align-items:flex-end'
    rightDiv.innerHTML = (`<h1 style=''>MOVES</h1>`)
    rightDiv.append(movetable)
    //$root.append(rightDiv)

    let righterDiv = document.createElement('righterDiv')
    righterDiv.id = 'righterDiv'
    righterDiv.style = 'height: 200px;width:250px;font-family: Verdana; font-size: 15px;background-color: mediumspringgreen;margin-top:20px; margin-bottom: 250px; display:flex; flex-direction: column;'
    righterDiv.innerHTML = (`<h3 style ="align-self:center">${player.name}`)
    righterDiv.innerHTML += (`<div id = 'scorest' style="align-self:center;display:flex;flex-direction: column"></div>`)
    righterDiv.innerHTML += (`<div id = 'scoresm' style="align-self:center;display:flex;flex-direction: column""></div>`)

    //righterDiv.innerHTML += (`<h3 style ="margin-left:25px;margin-right:25px">Search:</h3>`)
    //righterDiv.innerHTML += (`<form autocomplete="off" id = "searchform"><input style ="margin-left:25px;margin-right:25px" id="search" type="text"></form>`)
    rightDiv.append(righterDiv)
    $root.append(rightDiv)

    console.log(timeScoreBoard);
    console.log(moveScoreBoard);
    timeTableGenerator();
    moveTableGenerator();
    window.setInterval(function () {
        cashmoneyglock() 
        timeTableGenerator();
        moveTableGenerator()
        topTime();
        topMove();
    }, 2500);

    $root.on('click', "#previous", previousBoard);//self explantory
    $root.on('click', "#reset", resetBoard);
    $root.on('click', "#next", nextLevel);
    $root.on('click', "#time", timeUpdateBoard);//add in new player object to the array, it also returns the updated array
    $root.on('click', "#move", moveUpdateBoard);//add in new player object to the array, it also returns the updated array
    $root.on('click', '#flush', deleteData);

    window.addEventListener('keydown', keyDownEventListener)

    topTime();
    topMove();

    $root.on('click', '#LogOut', gameLogOut)

    // create keyboard functionality all of them

}

export const levelBuild = function (number) {
    number -= 1;

    let tableDiv = document.createElement('div');
    tableDiv.setAttribute('id', 'board')

    let levelTable = document.createElement('table');
    levelTable.style = ''
    tableDiv.append(levelTable);

    //let level = getLevel();
    let count = 0;

    board = JSON.parse(JSON.stringify(levelArray[number]))
    for (let i = 0; i < y; i++) {

        let row = document.createElement('tr');
        row.setAttribute('class', i)
        for (let j = 0; j < x; j++) {
            let rowFiller = document.createElement('td');
            rowFiller.setAttribute('class', j)

            if (board[i][j] == 0) {
                rowFiller.setAttribute('style', 'background-color: gray');
            } else if (board[i][j] == 1) {
                rowFiller.setAttribute('style', 'background-color: white');
            } else if (board[i][j] == 2) {
                //Player
                rowFiller.setAttribute('class', j + ' filled');
            }

            if (board[i][j] == 2) {
                player.y = i;
                player.x = j;
                rowFiller.setAttribute('id', 'player')
            }

            row.append(rowFiller);

            //count++;
        }
        tableDiv.append(row);
        //count += 2;
    }
    return tableDiv;
}

export async function move(dirction) {
    let findY;
    let findX;

    if (dirction == 'right') {
        let test = setInterval(function animate() {
            // color what ever space that color
            // Depending on how it is animated and logic; move one space at a time
            $(findY).find(findX).attr('id', '')
            //$(findY).find(findX).attr('src', '')

            if (board[player.y][player.x + 1] == 0) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;

                $(findY).find(findX).attr('id', 'player')
                clearInterval(test)
                if (player.moves >= minMove) {
                    player.won = boardChecker()
                    if (player.won) {
                        console.log('Won')

                        stopWatch = Date.now() - stopWatch;
                        clearInterval(myTime);
                        player.time = stopWatch / 1000;
                        const $timeboard = $('#timeboard');
                        $timeboard.empty();
                        $timeboard.append(`<h1>Time: ${player.time}</h1>`);
                        cansavetime = true;
                        cansavemove = true;
                        console.log(player.time);
                    }
                }

                return doneMove = true;
            } else if (board[player.y][player.x] >= 1) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;
                $(findY).find(findX).attr('class', player.x + ' filled')
                if (player.level == 2) {
                    $(".filled").css('background-color', '#fdee73')
                } else if (player.level == 3) {
                    $(".filled").css('background-color', '#74bbfb')
                } else if (player.level == 4) {
                    $(".filled").css('background-color', '#ff7124')
                } else if (player.level == 5) {
                    $(".filled").css('background-color', '#ff66ff')
                } else if (player.level == 6) {
                    $(".filled").css('background-color', '#6600ff')
                } else if (player.level == 7) {
                    $(".filled").css('background-color', '#18d17b')
                } else if (player.level == 8) {
                    $(".filled").css('background-color', '#fe0002')
                } else if (player.level == 9) {
                    $(".filled").css('background-color', '#fcfc5d')
                } else if (player.level == 10) {
                    $(".filled").css('background-color', '#0cbfe9')
                } else if (player.level == 11) {
                    $(".filled").css('background-color', '#c9a0ff')
                } else if (player.level == 12) {
                    $(".filled").css('background-color', '#f28e1c')
                } else if (player.level == 13) {
                    $(".filled").css('background-color', '#fabfe4')
                } else if (player.level == 14) {
                    $(".filled").css('background-color', '#0add08')
                } else if (player.level == 15) {
                    $(".filled").css('background-color', '#ffc82a')
                } else if (player.level == 16) {
                    $(".filled").css('background-color', '#E52B50')
                } else if (player.level == 17) {
                    $(".filled").css('background-color', '#0bf9ea')
                } else if (player.level == 18) {
                    $(".filled").css('background-color', '#ff7f00')
                } else if (player.level == 19) {
                    $(".filled").css('background-color', 'pink')
                } else if (player.level == 20) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                else if (player.level == 1) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                player.x += 1;
            }
            $(findY).find(findX).attr('id', 'player')
            //$(findY).find(findX).attr('src', 'https://w7.pngwing.com/pngs/1023/586/png-transparent-color-wheel-complementary-colors-green-gamut-cercle-blue-orange-color.png')


        }, speed)
    } else if (dirction == 'up') {
        let test = setInterval(function animate() {
            // color what ever space that color
            // Depending on how it is animated and logic; move one space at a time
            $(findY).find(findX).attr('id', '')

            if (board[player.y - 1][player.x] == 0) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;

                $(findY).find(findX).attr('id', 'player')
                clearInterval(test)
                if (player.moves >= minMove) {
                    player.won = boardChecker()
                    if (player.won) {
                        console.log('Won')

                        stopWatch = Date.now() - stopWatch;
                        clearInterval(myTime);
                        player.time = stopWatch / 1000;
                        const $timeboard = $('#timeboard');
                        $timeboard.empty();
                        $timeboard.append(`<h1>Time: ${player.time}</h1>`);
                        cansavetime = true;
                        cansavemove = true;
                        console.log(player.time);
                    }
                }

                return doneMove = true;
            } else if (board[player.y][player.x] >= 1) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;
                $(findY).find(findX).attr('class', player.x + ' filled')
                if (player.level == 2) {
                    $(".filled").css('background-color', '#fdee73')
                } else if (player.level == 3) {
                    $(".filled").css('background-color', '#74bbfb')
                } else if (player.level == 4) {
                    $(".filled").css('background-color', '#ff7124')
                } else if (player.level == 5) {
                    $(".filled").css('background-color', '#ff66ff')
                } else if (player.level == 6) {
                    $(".filled").css('background-color', '#6600ff')
                } else if (player.level == 7) {
                    $(".filled").css('background-color', '#18d17b')
                } else if (player.level == 8) {
                    $(".filled").css('background-color', '#fe0002')
                } else if (player.level == 9) {
                    $(".filled").css('background-color', '#fcfc5d')
                } else if (player.level == 10) {
                    $(".filled").css('background-color', '#0cbfe9')
                } else if (player.level == 11) {
                    $(".filled").css('background-color', '#c9a0ff')
                } else if (player.level == 12) {
                    $(".filled").css('background-color', '#f28e1c')
                } else if (player.level == 13) {
                    $(".filled").css('background-color', '#fabfe4')
                } else if (player.level == 14) {
                    $(".filled").css('background-color', '#0add08')
                } else if (player.level == 15) {
                    $(".filled").css('background-color', '#ffc82a')
                } else if (player.level == 16) {
                    $(".filled").css('background-color', '#E52B50')
                } else if (player.level == 17) {
                    $(".filled").css('background-color', '#0bf9ea')
                } else if (player.level == 18) {
                    $(".filled").css('background-color', '#ff7f00')
                } else if (player.level == 19) {
                    $(".filled").css('background-color', 'pink')
                } else if (player.level == 20) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                else if (player.level == 1) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                player.y -= 1;
            }
            $(findY).find(findX).attr('id', 'player')
        }, speed)
    } else if (dirction == 'left') {
        let test = setInterval(function animate() {
            // color what ever space that color
            // Depending on how it is animated and logic; move one space at a time
            $(findY).find(findX).attr('id', '')

            if (board[player.y][player.x - 1] == 0) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;

                $(findY).find(findX).attr('id', 'player')
                clearInterval(test)
                if (player.moves >= minMove) {
                    player.won = boardChecker()
                    if (player.won) {
                        console.log('Won')

                        stopWatch = Date.now() - stopWatch;
                        clearInterval(myTime);
                        player.time = stopWatch / 1000;
                        const $timeboard = $('#timeboard');
                        $timeboard.empty();
                        $timeboard.append(`<h1>Time: ${player.time}</h1>`);
                        cansavetime = true;
                        cansavemove = true;
                        console.log(player.time);
                    }
                }

                return doneMove = true;
            } else if (board[player.y][player.x] >= 1) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;
                $(findY).find(findX).attr('class', player.x + ' filled')
                if (player.level == 2) {
                    $(".filled").css('background-color', '#fdee73')
                } else if (player.level == 3) {
                    $(".filled").css('background-color', '#74bbfb')
                } else if (player.level == 4) {
                    $(".filled").css('background-color', '#ff7124')
                } else if (player.level == 5) {
                    $(".filled").css('background-color', '#ff66ff')
                } else if (player.level == 6) {
                    $(".filled").css('background-color', '#6600ff')
                } else if (player.level == 7) {
                    $(".filled").css('background-color', '#18d17b')
                } else if (player.level == 8) {
                    $(".filled").css('background-color', '#fe0002')
                } else if (player.level == 9) {
                    $(".filled").css('background-color', '#fcfc5d')
                } else if (player.level == 10) {
                    $(".filled").css('background-color', '#0cbfe9')
                } else if (player.level == 11) {
                    $(".filled").css('background-color', '#c9a0ff')
                } else if (player.level == 12) {
                    $(".filled").css('background-color', '#f28e1c')
                } else if (player.level == 13) {
                    $(".filled").css('background-color', '#fabfe4')
                } else if (player.level == 14) {
                    $(".filled").css('background-color', '#0add08')
                } else if (player.level == 15) {
                    $(".filled").css('background-color', '#ffc82a')
                } else if (player.level == 16) {
                    $(".filled").css('background-color', '#E52B50')
                } else if (player.level == 17) {
                    $(".filled").css('background-color', '#0bf9ea')
                } else if (player.level == 18) {
                    $(".filled").css('background-color', '#ff7f00')
                } else if (player.level == 19) {
                    $(".filled").css('background-color', 'pink')
                } else if (player.level == 20) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                else if (player.level == 1) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                player.x -= 1;
            }
            $(findY).find(findX).attr('id', 'player')
        }, speed)
    } else if (dirction == 'down') {
        let test = setInterval(function animate() {
            // color what ever space that color
            // Depending on how it is animated and logic; move one space at a time
            $(findY).find(findX).attr('id', '')

            if (board[player.y + 1][player.x] == 0) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;
                //$(findY).find(findX).attr('class', player.x + ' filled')

                $(findY).find(findX).attr('id', 'player')
                clearInterval(test)
                if (player.moves >= minMove) {
                    player.won = boardChecker();
                    if (player.won) {
                        console.log('Won')

                        stopWatch = Date.now() - stopWatch;
                        clearInterval(myTime);
                        player.time = stopWatch / 1000;
                        const $timeboard = $('#timeboard');
                        $timeboard.empty();
                        $timeboard.append(`<h1>Time: ${player.time}</h1>`);
                        cansavetime = true;
                        cansavemove = true;
                        console.log(player.time);
                    }
                }

                return doneMove = true;
            } else if (board[player.y][player.x] >= 1) {
                board[player.y][player.x] = 2;
                findY = '.' + player.y;
                findX = '.' + player.x;
                $(findY).find(findX).attr('class', player.x + ' filled')
                if (player.level == 2) {
                    $(".filled").css('background-color', '#fdee73')
                } else if (player.level == 3) {
                    $(".filled").css('background-color', '#74bbfb')
                } else if (player.level == 4) {
                    $(".filled").css('background-color', '#ff7124')
                } else if (player.level == 5) {
                    $(".filled").css('background-color', '#ff66ff')
                } else if (player.level == 6) {
                    $(".filled").css('background-color', '#6600ff')
                } else if (player.level == 7) {
                    $(".filled").css('background-color', '#18d17b')
                } else if (player.level == 8) {
                    $(".filled").css('background-color', '#fe0002')
                } else if (player.level == 9) {
                    $(".filled").css('background-color', '#fcfc5d')
                } else if (player.level == 10) {
                    $(".filled").css('background-color', '#0cbfe9')
                } else if (player.level == 11) {
                    $(".filled").css('background-color', '#c9a0ff')
                } else if (player.level == 12) {
                    $(".filled").css('background-color', '#f28e1c')
                } else if (player.level == 13) {
                    $(".filled").css('background-color', '#fabfe4')
                } else if (player.level == 14) {
                    $(".filled").css('background-color', '#0add08')
                } else if (player.level == 15) {
                    $(".filled").css('background-color', '#ffc82a')
                } else if (player.level == 16) {
                    $(".filled").css('background-color', '#E52B50')
                } else if (player.level == 17) {
                    $(".filled").css('background-color', '#0bf9ea')
                } else if (player.level == 18) {
                    $(".filled").css('background-color', '#ff7f00')
                } else if (player.level == 19) {
                    $(".filled").css('background-color', 'pink')
                } else if (player.level == 20) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                else if (player.level == 1) {
                    $(".filled").css('background-color', 'greenyellow')
                }
                player.y += 1;
            }
            $(findY).find(findX).attr('id', 'player')
        }, speed)
    }
}

export const boardChecker = function () {
    for (let i = 0; i < y; i++) {
        for (let j = 0; j < x; j++) {
            if (board[i][j] == 1) {
                return player.won = false;

            }
        }
    }
    return player.won = true;
}

export async function getTimeBoard(id) {
    return await boardGet(id, 'time');
}

export async function getMoveBoard(id) {
    return await boardGet(id, 'move');
}

export async function updateBoard(id, type, array) {
    const result = await boardSet(id, type, array);
}

export async function previousBoard() {
    if (player.level - 1 != 0) {
        console.log('previousLevel')
        player.level -= 1; // Go to Next Level
        player.won = false;
        player.time = 0;
        player.moves = 0;
        stopWatch = 0;
        firstMove = true;
        console.log(player.level)
        clearInterval(myTime);
        const $timeboard = $('#timeboard');
        $timeboard.empty();
        $timeboard.append(`<h1>Time: ${player.time}</h1>`);
        const $moveboard = $('#moveboard');
        $moveboard.empty();
        $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);
        timeScoreBoard = await getTimeBoard(player.level);
        moveScoreBoard = await getMoveBoard(player.level);
        $('#board').replaceWith(levelBuild(player.level))
        timeTableGenerator();
        moveTableGenerator();
        topTime();
        topMove();
        cansavetime = false;
        cansavemove = false;
        document.getElementById('currlevel').innerHTML = `<h1 style='font-weight: bold; font-family: Georgia'> Level: ${player.level}</h1>`
    }
}

export const resetBoard = function () {
    console.log('reset Level')
    cashmoneyglock() 
    //player.level += 1; // Go to Next Level
    player.won = false;
    player.time = 0;
    player.moves = 0;
    stopWatch = 0;
    firstMove = true;
    clearInterval(myTime);
    const $timeboard = $('#timeboard');
    $timeboard.empty();
    $timeboard.append(`<h1>Time: ${player.time}</h1>`);
    const $moveboard = $('#moveboard');
    $moveboard.empty();
    $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);
    console.log(player.level)
    $('#board').replaceWith(levelBuild(player.level))
    timeTableGenerator();
    moveTableGenerator();
    topTime();
    topMove();
    cansavetime = false;
    cansavemove = false;
}

export async function nextLevel() {
    if (player.level + 1 != 21) {
        console.log('nextLevel')
        player.level += 1; // Go to Next Level
        player.won = false;
        player.time = 0;
        player.moves = 0;
        stopWatch = 0;
        firstMove = true;
        clearInterval(myTime);
        const $timeboard = $('#timeboard');
        $timeboard.empty();
        $timeboard.append(`<h1>Time: ${player.time}</h1>`);
        const $moveboard = $('#moveboard');
        $moveboard.empty();
        $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);
        console.log(player.level)
        timeScoreBoard = await getTimeBoard(player.level);
        moveScoreBoard = await getMoveBoard(player.level);
        console.log(timeScoreBoard)
        console.log(moveScoreBoard)
        $('#board').replaceWith(levelBuild(player.level))
        timeTableGenerator();
        moveTableGenerator();
        topTime();
        topMove();
        cansavetime = false;
        cansavemove = false;
        document.getElementById('currlevel').innerHTML = `<h1 style='font-weight: bold; font-family: Georgia'> Level: ${player.level}</h1>`
    }
}

export async function timeUpdateBoard() {

    if (player.time == 0)
        return null
    let test = {
        "player": player.name,
        "time": player.time,
    }

    if (cansavetime == true) {

        //let timeDiv = document.createElement("div")
        //timeDiv.id = "times"

        timeScoreBoard.push(test)
        timeScoreBoard.sort(function (a, b) {
            return a.time - b.time
        })
        await updateBoard(player.level, "time", timeScoreBoard)
        timeScoreBoard = await getTimeBoard(player.level);
        console.log(timeScoreBoard)
        let timeTable = document.createElement("table")
        timeTable.id = "times"
        timeTable.style = "width: 250px;border:none;border-collapse: collapse; background-color: powderblue;text-align: center"
        //timeDiv.append(timeTable)
        let timeRowHeader = document.createElement("tr")
        timeRowHeader.style = "background-color: royalblue; font-family: sans-serif;color: white; text-align: left"
        let timeHeader0 = document.createElement("th")
        timeHeader0.innerText = ""
        let timeHeader1 = document.createElement("th")
        timeHeader1.innerText = "Player"
        let timeHeader2 = document.createElement("th")
        timeHeader2.innerText = "Time"

        timeRowHeader.append(timeHeader0)
        timeRowHeader.append(timeHeader1)
        timeRowHeader.append(timeHeader2)
        timeTable.append(timeRowHeader)

        /*
        lettimeTable2 = document.createElement("ol")
        timeTable2.id = "times"
        timeTable2.style = "border: 2px solid black; width: 10%; background-color: white; float: left; text-align: center"
        */
        //timeScoreBoard.forEach(e => {

        for (let i = 0; i < 10; i++) {
            let e = timeScoreBoard[i]
            let timeRow = document.createElement("tr")
            let timeData0 = document.createElement("td")
            timeData0.innerText = `${i + 1}`
            let timeData1 = document.createElement("td")
            let timeData2 = document.createElement("td")
            if (i >= timeScoreBoard.length) {
                timeData0.style = "opacity: 50%"
                timeData1.style = "opacity: 50%"
                timeData2.style = "opacity:50%"
                timeData1.innerText = 'N/A'
                timeData2.innerText = 'N/A'
            }
            else {
                timeData1.innerText = `${e.player}`
                timeData2.innerText = `${e.time}`
            }
            timeRow.append(timeData0)
            timeRow.append(timeData1)
            timeRow.append(timeData2)
            timeTable.append(timeRow)
            /** 
            timeRow2 = document.createElement("li")
            timeRow2.innerText = `${e.player} ${e.time}`
            timeTable2.append(timeRow2)
            */
            //});
        }
        document.getElementById("times").replaceWith(timeTable)
        cansavetime = false
        topTime();
    }
}

export async function moveUpdateBoard() {
    if (player.moves == 0)
        return null
    if (cansavemove == true) {
        moveScoreBoard.push({
            "player": player.name,
            "moves": player.moves,
        })

        moveScoreBoard.sort(function (a, b) {
            return a.moves - b.moves
        })
        await updateBoard(player.level, 'move', moveScoreBoard)
        moveScoreBoard = await getMoveBoard(player.level);
        console.log(moveScoreBoard);

        //let moveDiv = document.createElement("div")
        //moveDiv.id = "moves"
        let moveTable = document.createElement("table")
        moveTable.id = "moves"
        moveTable.style = "border: none;width: 250px;border-collapse: collapse;background-color: tomato; text-align: center"
        //moveDiv.append(moveTable)
        let moveRowHeader = document.createElement("tr")
        moveRowHeader.style = "background-color: red; color: white;font-family: sans-serif; text-align: left"
        let moveHeader0 = document.createElement("th")
        moveHeader0.innerText = ""
        let moveHeader1 = document.createElement("th")
        moveHeader1.innerText = "Player"
        let moveHeader2 = document.createElement("th")
        moveHeader2.innerText = "Moves"
        moveRowHeader.append(moveHeader0)
        moveRowHeader.append(moveHeader1)
        moveRowHeader.append(moveHeader2)
        moveTable.append(moveRowHeader)

        //moveScoreBoard.forEach(e => {
        for (let i = 0; i < 10; i++) {
            let e = moveScoreBoard[i]
            let moveRow = document.createElement("tr")
            let moveData0 = document.createElement("td")
            moveData0.innerText = `${i + 1}`
            let moveData1 = document.createElement("td")
            let moveData2 = document.createElement("td")
            if (i >= moveScoreBoard.length) {
                moveData1.style = "opacity: 50%"
                moveData2.style = "opacity:50%"
                moveData1.innerText = 'N/A'
                moveData2.innerText = 'N/A'
            }
            else {
                moveData1.innerText = `${e.player}`
                moveData2.innerText = `${e.moves}`
            }
            moveRow.append(moveData0)
            moveRow.append(moveData1)
            moveRow.append(moveData2)
            moveTable.append(moveRow)
            //});
        }
        document.getElementById("moves").replaceWith(moveTable)
        cansavemove = false
        topMove();
    }
}

export const timeTableGenerator = function () {

    timeScoreBoard.sort(function (a, b) {
        return a.time - b.time
    })
    let timeTable = document.createElement("table")
    timeTable.id = "times"
    timeTable.style = "border: none;width: 250px;border-collapse: collapse; background-color: powderblue;text-align: center"
    //timeDiv.append(timeTable)
    let timeRowHeader = document.createElement("tr")
    timeRowHeader.style = "background-color: royalblue; font-family: sans-serif;color: white; text-align: left"
    let timeHeader0 = document.createElement("th")
    timeHeader0.innerText = ""
    let timeHeader1 = document.createElement("th")
    timeHeader1.innerText = "Player"
    let timeHeader2 = document.createElement("th")
    timeHeader2.innerText = "Time"

    timeRowHeader.append(timeHeader0)
    timeRowHeader.append(timeHeader1)
    timeRowHeader.append(timeHeader2)
    timeTable.append(timeRowHeader)

    /*
    lettimeTable2 = document.createElement("ol")
    timeTable2.id = "times"
    timeTable2.style = "border: 2px solid black; width: 10%; background-color: white; float: left; text-align: center"
    */
    //timeScoreBoard.forEach(e => {

    for (let i = 0; i < 10; i++) {
        let e = timeScoreBoard[i]
        let timeRow = document.createElement("tr")
        timeRow.style = '.td {border:none}'
        let timeData0 = document.createElement("td")
        timeData0.innerText = `${i + 1}`
        let timeData1 = document.createElement("td")
        let timeData2 = document.createElement("td")
        if (i >= timeScoreBoard.length) {
            timeData0.style = "opacity: 50%"
            timeData1.style = "opacity: 50%"
            timeData2.style = "opacity:50%"
            timeData1.innerText = 'N/A'
            timeData2.innerText = 'N/A'
        }
        else {
            timeData1.innerText = `${e.player}`
            timeData2.innerText = `${e.time}`
        }
        timeRow.append(timeData0)
        timeRow.append(timeData1)
        timeRow.append(timeData2)
        timeTable.append(timeRow)
        /** 
        timeRow2 = document.createElement("li")
        timeRow2.innerText = `${e.player} ${e.time}`
        timeTable2.append(timeRow2)
        */
        //});
    }
    document.getElementById("times").replaceWith(timeTable)

}

export const moveTableGenerator = function () {

    moveScoreBoard.sort(function (a, b) {
        return a.moves - b.moves
    })
    let moveTable = document.createElement("table")
    moveTable.id = "moves"
    moveTable.style = "border: none;width: 250px;border-collapse: collapse;background-color: tomato; text-align: center"
    let moveRowHeader = document.createElement("tr")
    moveRowHeader.style = "background-color: red; color: white;font-family: sans-serif; text-align:left"
    let moveHeader0 = document.createElement("th")
    moveHeader0.innerText = ""
    let moveHeader1 = document.createElement("th")
    moveHeader1.innerText = "Player"
    let moveHeader2 = document.createElement("th")
    moveHeader2.innerText = "Moves"
    moveRowHeader.append(moveHeader0)
    moveRowHeader.append(moveHeader1)
    moveRowHeader.append(moveHeader2)
    moveTable.append(moveRowHeader)
    for (let i = 0; i < 10; i++) {
        let e = moveScoreBoard[i]
        let moveRow = document.createElement("tr")
        let moveData0 = document.createElement("td")
        moveData0.innerText = `${i + 1}`
        let moveData1 = document.createElement("td")
        let moveData2 = document.createElement("td")
        if (i >= moveScoreBoard.length) {
            moveData1.style = "opacity: 50%"
            moveData2.style = "opacity:50%"
            moveData1.innerText = 'N/A'
            moveData2.innerText = 'N/A'
        }
        else {
            moveData1.innerText = `${e.player}`
            moveData2.innerText = `${e.moves}`
        }
        moveRow.append(moveData0)
        moveRow.append(moveData1)
        moveRow.append(moveData2)
        moveTable.append(moveRow)
    }
    document.getElementById("moves").replaceWith(moveTable)
}

export const topTime = function () {
    for (let i =0; i < timeScoreBoard.length; i++){
        let rdx = timeScoreBoard[i]
        if(rdx.player == player.name){
            const $scorest = $('#scorest');
            $scorest.empty()
            $scorest.append(`<h3 style="align-self:center">Top Time Score: </h1>`);
            $scorest.append(`<h3 style="color: darkblue;align-self:center">${placeCompleter(i+1)}: ${rdx.time} seconds </h3>`)
            break;
        }
        const $scorest = $('#scorest');
        $scorest.empty()
        $scorest.append(`<h3 style="align-self:center">Top Time Score: </h1>`);
        $scorest.append(`<h3 style="color: darkblue;align-self:center"> N/A</h3>`)
    }
}

export const topMove = function () {
    for (let i =0; i < moveScoreBoard.length; i++){
        let rdx = moveScoreBoard[i]
        if(rdx.player == player.name){
            const $scoresm = $('#scoresm');
            $scoresm.empty()
            $scoresm.append(`<h3 style="align-self:center" >Top Move Score: </h1>`);
            $scoresm.append(`<h3 style="color: darkred;align-self:center">${placeCompleter(i+1)}: ${rdx.moves} moves </h3>`)
            break;
        }
        const $scoresm = $('#scoresm');
        $scoresm.empty()
        $scoresm.append(`<h3 style="align-self:center">Top Move Score:</h1>`);
        $scoresm.append(`<h3 style="color: darkred;align-self:center">N/A</h3>`)
    }
}

export const gameLogOut = function () {
    // logOut(); 
    window.localStorage.removeItem('user')
    let firebase = centralDataBase();
    firebase.auth().signOut();
    // window.location.href = '../login' 
    window.location.href = '../' // would be easier to put the login into the main directory instread of folder
}

export async function deleteData() {
    let a = moveScoreBoard.reduce((acc,val) => {
        if (val.player != player.name) {
            acc.push(val)
        }
        return acc
    }, [])

   let b = timeScoreBoard.reduce((acc,val) => {
    if (val.player != player.name) {
        acc.push(val)
    }
        return acc
    }, [])

    moveScoreBoard = a
    timeScoreBoard = b
    await updateBoard(player.level, 'move', moveScoreBoard)
    await updateBoard(player.level, "time", timeScoreBoard)

    timeTableGenerator();
    moveTableGenerator();
    resetBoard();
}

export async function keyDownEventListener(e) {
    if (e.target == document.getElementById('search')) {
        let wait = 1000
        if (e.key.length == 1)
            debounce(function() {
                autocomplete(document.getElementById('search').value)
            }, wait)()
    } else {
        switch (e.keyCode) { // move to seperate function and make it return something
            case 39:
                e.preventDefault();
                if (!player.won) {
                    if (firstMove) {
                        stopWatch = Date.now();
                        firstMove = false;


                        myTime = window.setInterval(function () {

                            let gjh = (Date.now() - stopWatch) / 1000
                            const $timeboard = $('#timeboard');
                            $timeboard.empty();
                            $timeboard.append(`<h1>Time: ${gjh}</h1>`);
                        }, 1);
                    }
                    if (doneMove) {
                        doneMove = false;
                        if (board[player.y][player.x + 1] != 0) {
                            player.moves +=1;
                        }
                        const $moveboard = $('#moveboard');
                        $moveboard.empty();
                        $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);
                        await move('right');
                    }
                }

                break;
            case 38:
                e.preventDefault();
                if (!player.won) {
                    if (firstMove) {
                        stopWatch = Date.now();
                        firstMove = false;

                        myTime = window.setInterval(function () {

                            let gjh = (Date.now() - stopWatch) / 1000
                            const $timeboard = $('#timeboard');
                            $timeboard.empty();
                            $timeboard.append(`<h1>Time: ${gjh}</h1>`);
                        }, 1);
                    }
                    if (doneMove) {
                        doneMove = false;
                        if (board[player.y - 1][player.x] != 0) {
                            player.moves += 1
                        }
                        const $moveboard = $('#moveboard');
                        $moveboard.empty();
                        $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);
                        await move('up');
                    }
                }
                break;
            case 37:
                e.preventDefault()
                if (!player.won) {
                    if (firstMove) {
                        stopWatch = Date.now();
                        firstMove = false;

                        myTime = window.setInterval(function () {

                            let gjh = (Date.now() - stopWatch) / 1000
                            const $timeboard = $('#timeboard');
                            $timeboard.empty();
                            $timeboard.append(`<h1>Time: ${gjh}</h1>`);
                        }, 1);
                    }
                    if (doneMove) {
                        doneMove = false;
                        if (board[player.y][player.x - 1] != 0) {
                            player.moves += 1
                        }
                        const $moveboard = $('#moveboard');
                        $moveboard.empty();
                        $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);

                        await move('left');
                    }
                }
                break;
            case 40:
                e.preventDefault();
                if (!player.won) {
                    if (firstMove) {
                        stopWatch = Date.now();
                        firstMove = false;

                        myTime = window.setInterval(function () {

                            let gjh = (Date.now() - stopWatch) / 1000
                            const $timeboard = $('#timeboard');
                            $timeboard.empty();
                            $timeboard.append(`<h1>Time: ${gjh}</h1>`);
                        }, 1);
                    }
                    if (doneMove) {
                        doneMove = false;
                        if (board[player.y + 1][player.x] != 0) {
                            player.moves += 1
                        }
                        
                        const $moveboard = $('#moveboard');
                        $moveboard.empty();
                        $moveboard.append(`<h1>Moves: ${player.moves}</h1>`);
                        await move('down');
                    }
                }
                break;

            case 78: // Press N to go to next level
                nextLevel()
                break;
            // turn these into functions
            case 82: // Press R to reset level
                resetBoard()
                break
            case 80: // Press P to go to previous level
                previousBoard()
                break
            case 84: // Press T to save time
                timeUpdateBoard();
            break

            case 77: // Press M to save moves
                moveUpdateBoard();
            break
        }
    }
}

export async function autocomplete(e)  {
    let div = document.getElementById('searchResults')
    let times = "N/A"
    let timesPlace = "N/A"
    let moves = "N/A"
    let movesPlace = "N/A"
    let name = ""
    let nameFound = false
    let j = moveScoreBoard.length
    if (j < timeScoreBoard.length)
        j = timeScoreBoard.length
    let foundTime = false;
    let foundMove = false;
    for (let i = 0; i < j; i++) {
        if (foundTime && foundMove) {
            break
        }
        else if (foundTime) {
            if (i < moveScoreBoard.length) {
                if (moveScoreBoard[i].player == name) {
                    moves = moveScoreBoard[i].moves
                    movesPlace = i
                    foundMove = true
                }
            }
        }
        else if (foundMove) {
            if (i < timeScoreBoard.length) {
                if (timeScoreBoard[i].player == name) {
                    times = timeScoreBoard[i].time
                    timesPlace = i
                    foundTime = true
                }
            }
        }
        else {
            if (i < timeScoreBoard.length) {
                if (nameFound) {
                    if (timeScoreBoard[i].player == name) {
                        times = timeScoreBoard[i].time
                        timesPlace = i
                        foundTime = true
                    }
                }
                else {
                    if (timeScoreBoard[i].player.startsWith(e)) {
                        times = timeScoreBoard[i].time
                        timesPlace = i
                        name = timeScoreBoard[i].player
                        nameFound = true
                        foundTime = true
                    }
                }
            }
            if (i < moveScoreBoard.length) {
                if (nameFound) {
                    if (moveScoreBoard[i].player == name) {
                        moves = moveScoreBoard[i].moves
                        movesPlace = i
                        foundMove = true
                    }
                }
                else {
                    if (moveScoreBoard[i].player.startsWith(e)) {
                        moves = moveScoreBoard[i].moves
                        movesPlace = i
                        name = moveScoreBoard[i].player
                        nameFound = true
                        foundMove = true
                    }
                }
            }
        }
    }
    if (nameFound) {
        
        let h2 = document.createElement('h3')
        h2.innerText = ` Top Time: ${times}`
        h2.style = "color:darkblue; margin-left:25px"
        let h3 = document.createElement('h3')
        h3.innerText = `Top Move: ${moves}`
        h3.style = "color:darkblue; margin-left:25px"
        let h4 = document.createElement('h3')
        h4.innerText = `Place: ${placeCompleter(timesPlace+1)}`
        h4.style = "color:darkred; margin-left:25px"
        let h5 = document.createElement('h3')
        h5.innerText = `Place: ${placeCompleter(movesPlace+1)}`
        h5.style = "color:darkred; margin-left:25px"
        div.innerHTML = ""
        //div.append(h1)
        div.append(h2)
        div.append(h4)
        div.append(h3)
        div.append(h5)
        document.getElementById("searchtext").innerText = `Search:    ${name}`
    } else {
        div.innerHTML = ""
        let h1 = document.createElement('h3')
        h1.style = "margin-top: 50px; margin-left:10px;color: white"
        h1.innerText = "Search returned 0 results"
        div.append(h1)
        document.getElementById("searchtext").innerText = `Search:    N/A`
    }
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function placeCompleter(num) {
    if (num == '1') {
        return num + 'st'
    }
    else if (num =='2') {
        return num + 'nd'
    }
    else if (num =='3') {
        return num + 'rd'
    }
    else {
        return num +'th'
    }
}

export async function cashmoneyglock() {
    timeScoreBoard = await getTimeBoard(player.level);
    moveScoreBoard = await getMoveBoard(player.level);
}