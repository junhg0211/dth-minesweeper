const fps = 30;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const imageMine = document.getElementById("image-mine");

let rowCount = 9, gameHeight;
let gameX, gameY;
let cellSize;
let mineCount = 10;

let horizontalPadding = 120,
    verticalPadding = 50;

let nowClick = false,
    nowMouseX = 0,
    nowMouseY = 0;

let board,
    showingCells;

function boardInit() {
    board = [];
    showingCells = [];
    for (let i = 0; i < rowCount; i++) {
        let row = [],
            showingRow = [];
        for (let j = 0; j < rowCount; j++) {
            row.push(0);
            showingRow.push(false);
        }
        board.push(row);
        showingCells.push(showingRow);
    }

    for (let i = 0; i < mineCount;) {
        // noinspection JSCheckFunctionSignatures
        let x = parseInt(rowCount * Math.random()),
            y = parseInt(rowCount * Math.random());
        if (board[y][x] !== 9) {
            board[y][x] = 9;
            i++;
        }
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
    let nowMousePosition = getCellPositionFromClient(nowMouseX, nowMouseY);
    // noinspection JSCheckFunctionSignatures
    let positionX = parseInt(nowMousePosition.x),
                positionY = parseInt(nowMousePosition.y);
    if (!Object.is(positionX, -0) && !Object.is(positionY, -0)
            && positionX < rowCount && positionY < rowCount) {
        // noinspection JSCheckFunctionSignatures
        showingCells[parseInt(position.y)][parseInt(position.x)] = true;
        // board[parseInt(position.y)][parseInt(position.x)] = 1;
    }
}

function mousemove(e) {
    nowMouseX = e.clientX;
    nowMouseY = e.clientY;
}

function tick() {

}

function getClientPositionFromCell(x, y) {
    return {x: gameX + x * cellSize, y: gameY + y * cellSize}
}

function getCellPositionFromClient(x, y) {
    return {x: (x - gameX) / cellSize, y: (y - gameY) / cellSize}
}

function render() {
    context.fillStyle = "#F9FFBD";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "lightgray";
    context.fillRect(gameX, gameY, gameHeight, gameHeight);

    let nowMousePosition = getCellPositionFromClient(nowMouseX, nowMouseY);

    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            let position = getClientPositionFromCell(x, y);
            let positionX = parseInt(nowMousePosition.x),
                positionY = parseInt(nowMousePosition.y);

            // noinspection JSCheckFunctionSignatures
            if (x === positionX && y === positionY
                    && !Object.is(positionX, -0) && !Object.is(positionY, -0)
                    && nowClick) {
                context.fillStyle = "#FFFFFF";
                context.fillRect(position.x, position.y, cellSize, cellSize)
            }

            if (showingCells[y][x]) {
                if (board[y][x] === 9) {
                    // context.fillStyle = "black";
                    // context.fillRect(position.x, position.y, cellSize, cellSize)
                    context.drawImage(imageMine, position.x, position.y, cellSize, cellSize);
                } else {
                    context.fillStyle = "#F9FFBD";
                    context.fillRect(position.x, position.y, cellSize, cellSize);
                }
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

    context.strokeStyle = "black";
    context.strokeRect(gameX, gameY, gameHeight, gameHeight);
}

window.addEventListener("resize", resize);
resize();
window.addEventListener("mousedown", mousedown);
window.addEventListener("mouseup", mouseup);
window.addEventListener("mousemove", mousemove);

setInterval(() => {
    tick();
    render();
}, 1000 / fps)
