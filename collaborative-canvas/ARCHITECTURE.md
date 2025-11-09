#  FLAM Project — Architecture & System Flow

###  Project Overview
The **FLAM Project — Collaborative Drawing Canvas** is a real-time web application that allows multiple users to draw together on the same shared canvas.  
It is built using **Node.js**, **Express**, and **WebSockets (ws)** for real-time synchronization between all connected clients.

---

##  System Architecture

### 🔹 High-Level Design

+-------------------------------+
| CLIENT |

(HTML, CSS, JS in Browser)
Canvas Rendering (2D Context)
User Input Events (Mouse)
WebSocket Communication
+-------------------------------+

pgsql
Copy code
          ↑
          |   Real-Time JSON Messages
          ↓
+-------------------------------+
| SERVER |

(Node.js + Express + ws)
WebSocket Server
Draw/Undo/Redo Management
User Connection Tracking
History Broadcast
+-------------------------------+

yaml
Copy code

---

##  Workflow Description

###  1. Client-Side Operations
1. The client displays an **HTML5 canvas** that detects user actions (mousedown, mousemove, mouseup).
2. Whenever a user draws, a **“draw” event** is created and sent as a JSON message via WebSocket.
3. The browser also sends:
   - **cursor** events (to show live cursors of users),
   - **undo/redo** actions,
   - and **clear** actions.
4. When the client receives updates from the server, it re-renders the drawing or clears the canvas accordingly.

---

###  2. Server-Side Operations
1. The server uses **Express** to serve static frontend files (HTML, CSS, JS).
2. A **WebSocket server** (`ws`) handles real-time communication between multiple clients.
3. The server keeps:
   - `drawingHistory`: stores all drawing strokes.
   - `undoneStrokes`: keeps track of undone strokes for redo.
4. Whenever a new event (draw, undo, redo, cursor) is received:
   - It’s processed.
   - Then broadcasted to all connected clients (except the sender for drawing events).

---

##  WebSocket Message Flow

###  Message Types & Examples

| Type | Direction | Description |
|------|------------|--------------|
| `draw` | Client → Server | Sent when a user draws a line on the canvas. |
| `cursor` | Client → Server | Sent when user moves the mouse to update cursor position. |
| `clear` | Client → Server | Clears the entire canvas for everyone. |
| `undo` | Client → Server | Removes the last stroke from drawing history. |
| `redo` | Client → Server | Reapplies a previously undone stroke. |
| `init` | Server → Client | Sends full canvas state to newly connected users. |
| `updateCanvas` | Server → Client | Broadcasts updated canvas state after undo/redo. |
| `userCount` | Server → Client | Updates the number of active users in real time. |

---

###  Example Draw Message
```json
{
  "type": "draw",
  "x0": 220,
  "y0": 180,
  "x1": 260,
  "y1": 220,
  "color": "#000000",
  "size": 5
}
 Example Cursor Message
json
Copy code
{
  "type": "cursor",
  "x": 400,
  "y": 300,
  "color": "hsl(180, 70%, 50%)"
}
Undo / Redo Logic
The Undo/Redo system is managed centrally on the server:

Undo:

The last stroke is removed from drawingHistory and added to undoneStrokes.

The updated canvas state is broadcast to all clients.

Redo:

The most recent undone stroke is moved back from undoneStrokes to drawingHistory.

The canvas is re-rendered for all users.

This ensures global synchronization — all users see the same final state.

Data Structures Used
js
Copy code
let drawingHistory = [];  // Stores all strokes drawn
let undoneStrokes = [];   // Stores undone strokes for redo
Each stroke object contains:

js
Copy code
{
  type: "draw",
  x0: Number,
  y0: Number,
  x1: Number,
  y1: Number,
  color: String,
  size: Number
}
 Data Flow Summary
User Action → Client:
User draws → browser captures coordinates → sends draw event.

Client → Server:
JSON event sent via WebSocket.

Server → Other Clients:
Server broadcasts event → other clients update canvas.

Undo/Redo:
Server modifies drawingHistory → re-broadcasts updateCanvas.

New User:
Server sends init message with full drawing history.

 Performance Considerations
Uses WebSocket instead of HTTP polling — faster and more efficient.

Draw events are sent as compact JSON objects.

The canvas re-renders only when necessary (on draw, undo, redo, or clear).

User count dynamically updates on join/leave.

 Limitations
All users share a global canvas (no private layers).

Server doesn’t persist data to a database (drawing lost on restart).

Cursor positions may overlap if many users draw simultaneously.

 Future Enhancements
Add user authentication and user-specific colors.

Save and reload drawings from a database.

Add a chat feature using the same WebSocket channel.

Add mobile touch drawing support.

✍️ Author
Name: Charitha Nalipireddy
Project Title: FLAM Project — Collaborative Drawing Canvas
Time: 2-4hrs