
let canvas, ctx;
let drawing = false;
let lastX = 0, lastY = 0;
let brushColor = "#1e88e5";
let brushSize = 6;
let socketApi = null;

let drawingHistory = [];
let undoneHistory = [];

export function initCanvas(api) {
  socketApi = api;
  canvas = document.getElementById("board");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);

  const colorPicker = document.getElementById("colorPicker");
  const size = document.getElementById("brushSize");
  const eraserBtn = document.getElementById("eraser");
  const clearBtn = document.getElementById("clear");

 
  const undoBtn = document.createElement("button");
  undoBtn.textContent = "Undo";
  undoBtn.id = "undo";
  document.querySelector(".toolbar").appendChild(undoBtn);

  const redoBtn = document.createElement("button");
  redoBtn.textContent = "Redo";
  redoBtn.id = "redo";
  document.querySelector(".toolbar").appendChild(redoBtn);

  brushColor = colorPicker.value;
  brushSize = Number(size.value);

  colorPicker.addEventListener("input", (e) => {
    brushColor = e.target.value;
    eraserBtn.classList.remove("active");
  });
  size.addEventListener("input", (e) => (brushSize = Number(e.target.value)));
  eraserBtn.addEventListener("click", () => {
    if (eraserBtn.classList.contains("active")) {
      eraserBtn.classList.remove("active");
      brushColor = colorPicker.value;
    } else {
      eraserBtn.classList.add("active");
      brushColor = "#ffffff";
    }
  });

  clearBtn.addEventListener("click", () => {
    clearLocal();
    socketApi.sendClear();
  });

  undoBtn.addEventListener("click", () => {
    performUndo();
    socketApi.sendUndo();
  });

  redoBtn.addEventListener("click", () => {
    performRedo();
    socketApi.sendRedo();
  });

  socketApi.on("draw", (d) => {
    drawLine(d.x0, d.y0, d.x1, d.y1, d.color, d.size, false);
  });
  socketApi.on("clear", () => clearLocal());
  socketApi.on("undo", () => performUndo(false));
  socketApi.on("redo", () => performRedo(false));
  socketApi.on("userCount", (n) => {
    const el = document.getElementById("userCount");
    if (el) el.textContent = `Active users: ${n}`;
  });
}

function resizeCanvas() {
  const toolbarHeight =
    document.querySelector(".title-bar").offsetHeight +
    document.querySelector(".toolbar").offsetHeight;
  const img = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = Math.max(200, window.innerHeight - toolbarHeight);
  if (img) ctx.putImageData(img, 0, 0);
  ctx.lineJoin = ctx.lineCap = "round";
}

function pointerDown(e) {
  drawing = true;
  const r = canvas.getBoundingClientRect();
  lastX = e.clientX - r.left;
  lastY = e.clientY - r.top;
  undoneHistory = [];
}

function pointerMove(e) {
  if (!drawing) return;
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  drawLine(lastX, lastY, x, y, brushColor, brushSize, true);
  socketApi.sendDrawing({ x0: lastX, y0: lastY, x1: x, y1: y, color: brushColor, size: brushSize });
  lastX = x;
  lastY = y;
}

function pointerUp() {
  drawing = false;
}

function drawLine(x0, y0, x1, y1, color, size, push = false) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.stroke();
  ctx.closePath();
  if (push) drawingHistory.push({ x0, y0, x1, y1, color, size });
}

function clearLocal() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory = [];
  undoneHistory = [];
}

function performUndo(pushRemote = true) {
  if (drawingHistory.length === 0) return;
  const last = drawingHistory.pop();
  undoneHistory.push(last);
  redrawAll();
  if (pushRemote) socketApi.sendUndo();
}

function performRedo(pushRemote = true) {
  if (undoneHistory.length === 0) return;
  const stroke = undoneHistory.pop();
  drawingHistory.push(stroke);
  redrawAll();
  if (pushRemote) socketApi.sendRedo();
}

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory.forEach((s) => drawLine(s.x0, s.y0, s.x1, s.y1, s.color, s.size));
}
