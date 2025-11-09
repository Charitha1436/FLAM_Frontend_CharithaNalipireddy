import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });


app.use(express.static(path.join(__dirname, "../client")));

function broadcast(obj, exceptSocket = null) {
  const raw = JSON.stringify(obj);
  wss.clients.forEach((c) => {
    if (c.readyState === 1 && c !== exceptSocket) {
      c.send(raw);
    }
  });
}

wss.on("connection", (ws) => {
  console.log(" New WebSocket connection");

 
  broadcast({ type: "userCount", count: wss.clients.size });

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch {
      return;
    }

    if (["draw", "clear", "undo", "redo"].includes(data.type)) {
      broadcast(data, ws);
    }
  });

  ws.on("close", () => {
    console.log(" Connection closed");
    broadcast({ type: "userCount", count: wss.clients.size });
  });

  ws.on("error", (err) => console.error(" WS error:", err));
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
