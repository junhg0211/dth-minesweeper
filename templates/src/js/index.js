const canvas = document.getElementById("main-canvas");
const context = canvas.getContext("2d");

var width = canvas.clientWidth
  , height = canvas.clientHeight;

function refreshSize() {
    canvas.width = width;
    canvas.height = height;
}
refreshSize();

context.fillStyle = '#fdde59';
context.fillRect(0, 0, width, height);

context.font = "64px Georgia";
context.fillStyle = "#2c2c2c";
context.fillText("Hello, wolrd!", 0, 100);