const fps = 30;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const imageMine = document.getElementById("image-mine");
const images = [];
for (let i = 1; i <= 8; i++) {
    images.push(document.getElementById(`image-${i}`));
}

let rowCount = 9,
    gameHeight;
let gameX,
    gameY;
let cellSize;
let mineCount = 10;

let horizontalPadding = 120,
    verticalPadding = 50;

let nowClick = false,
    nowMouseX = 0,
    nowMouseY = 0;

let board,
    showingCells;

/**
 * `boardInit()` initializes the board.
 * This forms the actual border of `board`, places mines, and numbers.
 */
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

    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            if (board[y][x] === 9) continue;
            let count = 0;
            let upAvailable = y - 1 >= 0,
                downAvailable = y + 1 < rowCount,
                leftAvailable = x - 1 >= 0,
                rightAvailable = x + 1 < rowCount;
            if (leftAvailable) {
                if (upAvailable) if (board[y - 1][x - 1] === 9) count++;
                if (downAvailable) if (board[y + 1][x - 1] === 9) count++;
                if (board[y][x - 1] === 9) count++;
            }
            if (rightAvailable) {
                if (upAvailable) if (board[y - 1][x + 1] === 9) count++;
                if (downAvailable) if (board[y + 1][x + 1] === 9) count++;
                if (board[y][x + 1] === 9) count++;
            }
            if (upAvailable) if (board[y - 1][x] === 9) count++;
            if (downAvailable) if (board[y + 1][x] === 9) count++;

            board[y][x] = count;
        }
    }
}

boardInit();

/**
 * The window resize event handler.
 */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameHeight = Math.min(canvas.height - verticalPadding * 2, canvas.width - horizontalPadding * 2);
    cellSize = gameHeight / rowCount;

    gameX = (canvas.width - gameHeight) / 2;
    gameY = (canvas.height - gameHeight) / 2;
}

/**
 * The mousedown event handler.
 * @param e the mousedown event
 */
function mousedown(e) {
    nowClick = true;
}

/**
 * The mouseup event handler.
 * @param e the mouseup event
 */
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
    }
}

/**
 * The mousemove event handler.
 * @param e mousemove event
 */
function mousemove(e) {
    nowMouseX = e.clientX;
    nowMouseY = e.clientY;
}

/**
 * The loop ticker.
 * Every frame, `tick()` is called before `render()`.
 * It mainly has responsibility for calculating variables for rendering the graphics.
 */
function tick() {

}

/**
 * Returns the absolute client position from cell position.
 * For example, `getClientPositionFromCell(0, 0)` returns `{x: gameX, y: gameY}`.
 * @param x the cell x coordinate that will converted into client x coordinate.
 * @param y the cell y coordinate that will converter into client y coordinate.
 * @returns {{x: *, y: *}} the absolute client position.
 */
function getClientPositionFromCell(x, y) {
    return {x: gameX + x * cellSize, y: gameY + y * cellSize}
}

/**
 * The inverse function of `getClientPositionFromCell(x, y)`.
 * Returns the game position from actual absolute client position.
 * @param x the actual x coordinate that will converted into cell x coordinate.
 * @param y the actual y coordinate that will converted into cell y coordinate.
 * @returns {{x: number, y: number}} the game position.
 */
function getCellPositionFromClient(x, y) {
    return {x: (x - gameX) / cellSize, y: (y - gameY) / cellSize}
}

/**
 * Renders the display.
 * Every frame, this is called after tick().
 * It mainly has responsibility of rendering variables to actual graphic.
 */
function render() {
    context.fillStyle = "#F9FFBD";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "lightgray";
    context.fillRect(gameX, gameY, gameHeight, gameHeight);

    let nowMousePosition = getCellPositionFromClient(nowMouseX, nowMouseY);

    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            let position = getClientPositionFromCell(x, y);
            // noinspection JSCheckFunctionSignatures
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
                if (1 <= board[y][x] && board[y][x] <= 8) {
                    context.drawImage(images[board[y][x] - 1], position.x, position.y, cellSize, cellSize);
                } else if (board[y][x] === 9) {
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
