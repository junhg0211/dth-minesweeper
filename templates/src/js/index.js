const fps = 30;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let rowCount = 9, gameHeight;
let gameX, gameY;
let cellSize;

let horizontalPadding = 360,
    verticalPadding = 50;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameHeight = Math.min(canvas.height - verticalPadding * 2, canvas.width - horizontalPadding * 2);
    cellSize = gameHeight / rowCount;

    gameX = (canvas.width - gameHeight) / 2;
    gameY = (canvas.height - gameHeight) / 2;
}

function tick() {

}

function render() {
    context.fillStyle = 'lightgray';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'black';
    context.strokeRect(gameX, gameY, gameHeight, gameHeight);
}

window.addEventListener('resize', resize);
resize();

setInterval(() => {
    tick();
    render();
}, 1000 / fps)

// context.fillStyle = '#fdde59';
// context.fillRect(0, 0, width, height);
//
// context.font = "64px Georgia";
// context.fillStyle = "#2c2c2c";
// context.fillText("Hello, wolrd!", 0, 100);