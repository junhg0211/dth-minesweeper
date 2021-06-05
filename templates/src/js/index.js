const fps = 60;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const imageMine = document.getElementById("image-mine");
const imageFri = document.getElementById("image-fri");
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
let initialized = false;

let screenshakeX = 0,
    screenshakeY = 0,
    screenshakeDelta = 0,
    screenshakeFriction = Math.pow(80, 1/fps);

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

    initialized = true;
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

    context.imageSmoothingEnabled = false;
}
resize();

/**
 * The mousedown event handler.
 * @param e the mousedown event
 */
function mousedown(e) {
    if (e.button === 0) {
        nowClick = true;
    }
}

/**
 * Envokes the screenshaking.
 * @param delta how strong is the screenshaking
 */
function envokeScreenshake(delta) {
    screenshakeDelta += delta;
}

/**
 * With calling this function,
 * any neighbor of `board[y][x] === 0` will recursively be showed by
 * assigning `showingCells[y][x]` to `true`.
 * @param x the anchor of finding this instance in x coordinate
 * @param y the anchor of finding this instance in y coordinate
 */
function recursivelyShow(x, y) {
    if (showingCells[y][x]) return;
    else showingCells[y][x] = true;

    if (board[y][x] === 9) envokeScreenshake(mineCount * 10);
    else if (board[y][x] !== 0) return;

    let negativeX = false,
        negativeY = false,
        positiveX = false;

    if (x - 1 >= 0) {
        recursivelyShow(x - 1, y);
        negativeX = true;
    }
    if (y - 1 >= 0) {
        recursivelyShow(x, y - 1);
        if (negativeX) recursivelyShow(x - 1, y - 1);
        negativeY = true;
    }
    if (x + 1 < rowCount) {
        recursivelyShow(x + 1, y);
        if (negativeY) recursivelyShow(x + 1, y - 1);
        positiveX = true;
    }
    if (y + 1 < rowCount) {
        recursivelyShow(x, y + 1);
        if (negativeX) recursivelyShow(x - 1, y + 1);
        if (positiveX) recursivelyShow(x + 1, y + 1);
    }
}

/**
 * Recursively shows from this current mouse position
 * under sure of mouse position is valid.
 */
function reveal(positionX, positionY) {
    // noinspection JSCheckFunctionSignatures
    if (!Object.is(positionX, -0) && !Object.is(positionY, -0)
        && positionX < rowCount && positionY < rowCount) {
        // noinspection JSCheckFunctionSignatures
        recursivelyShow(positionX, positionY);
    }
}

/**
 * The mouseup event handler.
 * @param e the mouseup event
 */
function mouseup(e) {
    let position = getCellPositionFromClient(e.clientX, e.clientY);
    // noinspection JSCheckFunctionSignatures
    let positionX = parseInt(position.x),
        positionY = parseInt(position.y);

    if (e.button === 0) {
        nowClick = false;
        if (showingCells[positionY][positionX]) {
            let mineCount = 0;

            let negativeX = false,
                negativeY = false,
                positiveX = false,
                positiveY = false;

            if (positionX - 1 >= 0) {
                if (showingCells[positionY][positionX - 1] === null) mineCount++;
                negativeX = true;
            }
            if (positionY - 1 >= 0) {
                if (showingCells[positionY - 1][positionX] === null) mineCount++;
                if (negativeX && showingCells[positionY - 1][positionX - 1] === null) mineCount++;
                negativeY = true;
            }
            if (positionX + 1 < rowCount) {
                if (showingCells[positionY][positionX + 1] === null) mineCount++;
                if (negativeY && showingCells[positionY - 1][positionX + 1] === null) mineCount++;
                positiveX = true;
            }
            if (positionY + 1 < rowCount) {
                if (showingCells[positionY + 1][positionX] === null) mineCount++;
                if (negativeX && showingCells[positionY + 1][positionX - 1] === null) mineCount++;
                if (positiveX && showingCells[positionY + 1][positionX + 1] === null) mineCount++;
                positiveY = true;
            }
            
            if (mineCount === board[positionY][positionX]) {
                if (negativeX) {
                    if (showingCells[positionY][positionX - 1] === false) recursivelyShow(positionX - 1, positionY);
                }
                if (positiveX) {
                    if (showingCells[positionY][positionX + 1] === false) recursivelyShow(positionX + 1, positionY);
                }
                if (positiveY) {
                    if (showingCells[positionY + 1][positionX] === false) recursivelyShow(positionX, positionY + 1);
                    if (negativeX && showingCells[positionY + 1][positionX - 1] === false)
                        recursivelyShow(positionX - 1, positionY + 1);
                    if (positiveX && showingCells[positionY + 1][positionX + 1] === false)
                        recursivelyShow(positionX + 1, positionY + 1);
                }
                if (negativeY) {
                    if (showingCells[positionY - 1][positionX] === false) recursivelyShow(positionX, positionY - 1);
                    if (negativeX && showingCells[positionY - 1][positionX - 1] === false)
                        recursivelyShow(positionX - 1, positionY - 1);
                    if (positiveX && showingCells[positionY - 1][positionX + 1] === false)
                        recursivelyShow(positionX + 1, positionY - 1);
                }
            }
        } else if (showingCells[positionY][positionX] === false) {
            if (initialized) {
                while (board[positionY][positionX] !== 0) {
                    boardInit();
                }
                initialized = false;
            }
            reveal(positionX, positionY);
        }
    } else if (e.button === 2) {
        if (!Object.is(positionX, -0) && !Object.is(positionY, -0)
            && positionX < rowCount && positionY < rowCount) {
            if (showingCells[positionY][positionX] === null) {
                showingCells[positionY][positionX] = false;
            } else if (showingCells[positionY][positionX] === false) {
                showingCells[positionY][positionX] = null;
            }
        }
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
 * A handler for preventing contextmenu opening and
 * handling right click.
 */
function contextmenu(e) {
    e.preventDefault();
}

/**
 * The loop ticker.
 * Every frame, `tick()` is called before `render()`.
 * It mainly has responsibility for calculating variables for rendering the graphics.
 */
function tick() {
    if (screenshakeDelta !== 0) {
        screenshakeX = (Math.random() * 2 - 1) * screenshakeDelta;
        screenshakeY = (Math.random() * 2 - 1) * screenshakeDelta;
        screenshakeDelta /= screenshakeFriction;
        if (screenshakeDelta < 0.5) {
            screenshakeDelta = 0;
            screenshakeX = 0;
            screenshakeY = 0;
        }
    }
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
    context.fillRect(gameX + screenshakeX, gameY + screenshakeY, gameHeight, gameHeight);

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
                context.fillRect(position.x + screenshakeX, position.y + screenshakeY, cellSize, cellSize)
            }

            if (showingCells[y][x]) {
                if (1 <= board[y][x] && board[y][x] <= 8) {
                    context.drawImage(images[board[y][x] - 1], position.x + screenshakeX, position.y + screenshakeY, cellSize, cellSize);
                } else if (board[y][x] === 9) {
                    context.drawImage(imageMine, position.x + screenshakeX, position.y + screenshakeY, cellSize, cellSize);
                } else {
                    context.fillStyle = "#F9FFBD";
                    context.fillRect(position.x + screenshakeX, position.y + screenshakeY, cellSize, cellSize);
                }
            } else if (showingCells[y][x] === null) {
                context.drawImage(imageFri, position.x + screenshakeX, position.y + screenshakeY, cellSize, cellSize);
            }
        }
    }

    for (let i = 1; i < rowCount; i++) {
        let position = getClientPositionFromCell(i, i);

        context.beginPath();
        context.moveTo(position.x + screenshakeX, gameY + screenshakeY);
        context.lineTo(position.x + screenshakeX, gameY + gameHeight + screenshakeY);
        context.stroke();

        context.beginPath();
        context.moveTo(gameX + screenshakeX, position.y + screenshakeY);
        context.lineTo(gameX + gameHeight + screenshakeX, position.y + screenshakeY);
        context.stroke();
    }

    context.strokeStyle = "black";
    context.strokeRect(gameX + screenshakeX, gameY + screenshakeY, gameHeight, gameHeight);
}

window.addEventListener("resize", resize);
window.addEventListener("mousedown", mousedown);
window.addEventListener("mouseup", mouseup);
window.addEventListener("mousemove", mousemove);
window.addEventListener("contextmenu", contextmenu)

setInterval(() => {
    tick();
    render();
}, 1000 / fps)
