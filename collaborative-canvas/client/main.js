
import { initCanvas } from "./canvas.js";
import { createSocketAPI } from "./websocket.js";

const socketAPI = createSocketAPI();
initCanvas(socketAPI);
