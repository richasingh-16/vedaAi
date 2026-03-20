import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { WsEvent } from "../types";

// Map of assignmentId → Set of connected clients
const subscribers = new Map<string, Set<WebSocket>>();

export function setupWebSocket(wss: WebSocketServer): void {
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    try {
      const url = new URL(req.url || "", "http://localhost");
      const assignmentId = url.searchParams.get("assignmentId");

      if (!assignmentId) {
        console.warn("⚠️ WS connection attempt without assignmentId");
        ws.close(1008, "Missing assignmentId");
        return;
      }

      // Subscribe this client to the assignment
      if (!subscribers.has(assignmentId)) {
        subscribers.set(assignmentId, new Set());
      }
      subscribers.get(assignmentId)!.add(ws);

      console.log(`🔌 WS client connected for assignment: ${assignmentId}`);

      ws.on("close", () => {
        const clients = subscribers.get(assignmentId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) subscribers.delete(assignmentId);
        }
        console.log(`🔌 WS client disconnected from assignment: ${assignmentId}`);
      });

      ws.on("error", (err) => {
        console.error(`❌ WS error for assignment ${assignmentId}:`, err);
      });

      // Send initial ack
      safeSend(ws, { type: "assignment:queued", assignmentId });
    } catch (err) {
      console.error("❌ WS connection initialization error:", err);
      ws.close(1011, "Internal server error");
    }
  });
}

// Emit an event to all clients watching a specific assignment
export function emitToAssignment(assignmentId: string, event: WsEvent): void {
  const clients = subscribers.get(assignmentId);
  if (!clients || clients.size === 0) return;

  const message = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }

  console.log(
    `📡 WS emit [${event.type}] → assignment ${assignmentId} (${clients.size} client(s))`
  );
}

function safeSend(ws: WebSocket, data: unknown): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}
