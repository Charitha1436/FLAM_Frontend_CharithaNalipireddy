const socket = new WebSocket("ws://localhost:3000");
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;
let lastX = 0, lastY = 0;
let color = document.getElementById("colorPicker").value;
let size = document.getElementById("brushSize").value;
let isEraser = false;

document.getElementById("colorPicker").addEventListener("input", e => color = e.target.value);
document.getElementById("brushSize").addEventListener("input", e => size = e.target.value);

document.getElementById("eraser").addEventListener("click", () => {
  isEraser = !isEraser;
  document.getElementById("eraser").style.backgroundColor = isEraser ? "#d3d3d3" : "";
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.send(JSON.stringify({ type: "clear" }));
});

canvas.addEventListener("mousedown", e => {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);

canvas.addEventListener("mousemove", e => {
  if (!drawing) return;
  const drawColor = isEraser ? "#ffffff" : color;

  const data = {
    type: "draw",
    x0: lastX,
    y0: lastY,
    x1: e.offsetX,
    y1: e.offsetY,
    color: drawColor,
    size: size
  };

  drawLine(data);
  socket.send(JSON.stringify(data));

  [lastX, lastY] = [e.offsetX, e.offsetY];
});

function drawLine(data) {
  ctx.beginPath();
  ctx.moveTo(data.x0, data.y0);
  ctx.lineTo(data.x1, data.y1);
  ctx.strokeStyle = data.color;
  ctx.lineWidth = data.size;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "draw") drawLine(data);
  else if (data.type === "clear") ctx.clearRect(0, 0, canvas.width, canvas.height);
};
