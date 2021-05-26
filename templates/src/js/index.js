const fps = 30;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let rowCount = 9, gameHeight;
let gameX, gameY;
let cellSize;

let horizontalPadding = 120,
    verticalPadding = 50;

let nowClick = false;

let board

function boardInit() {
    board = [];
    for (let i = 0; i < rowCount; i++) {
        let row = [];
        for (let j = 0; j < rowCount; j++) {
            row.push(0)
        }
        board.push(row);
    }
}
boardInit();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameHeight = Math.min(canvas.height - verticalPadding * 2, canvas.width - horizontalPadding * 2);
    cellSize = gameHeight / rowCount;

    gameX = (canvas.width - gameHeight) / 2;
    gameY = (canvas.height - gameHeight) / 2;
}

function mousedown(e) {
    nowClick = true;
}

function mouseup(e) {
    nowClick = false;

    let position = getCellPositionFromClient(e.clientX, e.clientY);
    // noinspection JSCheckFunctionSignatures
    board[parseInt(position.y)][parseInt(position.x)] = 1;
}

function tick() {

}

function getClientPositionFromCell(x, y) {
    return {'x': gameX + x * cellSize, 'y': gameY + y * cellSize}
}

function getCellPositionFromClient(x, y) {
    return {'x': (x - gameX) / cellSize, 'y': (y - gameY) / cellSize}
}

function render() {
    context.fillStyle = 'lightgray';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            if (board[y][x] === 1) {
                let position = getClientPositionFromCell(x, y);

                context.fillStyle = "black";
                context.fillRect(position.x, position.y, cellSize, cellSize)
            }
        }
    }

    for (let i = 1; i < rowCount; i++) {
        let position = getClientPositionFromCell(i, i);

        context.beginPath();
        context.moveTo(position.x, gameY);
        context.lineTo(position.x, gameY + gameHeight);
        context.stroke();

        context.beginPath();
        context.moveTo(gameX, position.y);
        context.lineTo(gameX + gameHeight, position.y);
        context.stroke();
    }

    context.strokeStyle = 'black';
    context.strokeRect(gameX, gameY, gameHeight, gameHeight);
}

window.addEventListener('resize', resize);
resize();
window.addEventListener('mousedown', mousedown);
window.addEventListener('mouseup', mouseup);

setInterval(() => {
    tick();
    render();
}, 1000 / fps)
