
export function createSocketAPI() {
 const socket = new WebSocket(
  window.location.origin.replace(/^http/, "ws")
);


  const handlers = {
    onDraw: null,
    onClear: null,
    onUndo: null,
    onRedo: null,
    onUserCount: null
  };

  socket.addEventListener("open", () => console.log("WebSocket connected"));
  socket.addEventListener("error", (e) => console.error("WebSocket error", e));

  socket.addEventListener("message", (ev) => {
    let data;
    try { data = JSON.parse(ev.data); } catch { return; }

    switch (data.type) {
      case "draw": handlers.onDraw?.(data); break;
      case "clear": handlers.onClear?.(); break;
      case "undo": handlers.onUndo?.(); break;
      case "redo": handlers.onRedo?.(); break;
      case "userCount": handlers.onUserCount?.(data.count); break;
    }
  });

  function send(obj) {
    if (socket.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify(obj));
  }

  return {
    sendDrawing: (d) => send({ type: "draw", ...d }),
    sendClear: () => send({ type: "clear" }),
    sendUndo: () => send({ type: "undo" }),
    sendRedo: () => send({ type: "redo" }),
    on: (event, cb) => { handlers[`on${capitalize(event)}`] = cb; }
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
