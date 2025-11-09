#  FLAM Project — Collaborative Drawing Canvas

###  Overview
The **FLAM Project** is a real-time collaborative drawing web application that allows multiple users to draw together on a shared online canvas.  
It uses **Node.js (Express)** and **WebSockets** to synchronize drawing, cursor movement, and undo/redo actions instantly between all connected users.

---

###  Features
-  **Freehand Drawing:** Users can draw lines on the canvas using their mouse.
-  **Color & Brush Control:** Select brush color and size.
-  **Eraser:** Toggle eraser mode to remove parts of the drawing.
-  **Clear Canvas:** Wipes the canvas for all users simultaneously.
-  **Multi-User Collaboration:** Drawings are shared in real-time across all open tabs or users.
-  **Live Cursors:** Displays each user’s cursor position on others’ screens.
-  **Undo / Redo:** Works globally — one user’s undo or redo updates all canvases.
-  **Active User Counter:** Displays how many users are connected live.
-  **Responsive Design:** Canvas automatically resizes to fit the window.

---

###  Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js with Express
- **Real-Time Communication:** WebSocket (via `ws` library)

---

###  How to Run

1. Open a terminal and navigate to the project folder:
   cd collaborative-canvas
2. Install dependencies:
   npm install
 Start the server:
    npm start
Open your browser and visit:
    http://localhost:3000

    Folder Structure
collaborative-canvas/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   ├── canvas.js
|   └── websocket.js
│
├── server/
│   └── server.js
│
├── package.json
└── README.md

Author
Name: Charitha Nalipireddy
Project Title: FLAM Project — Collaborative Drawing Canvas