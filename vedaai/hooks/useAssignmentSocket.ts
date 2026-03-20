"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { AssignmentResult } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/ws";

interface WsEvent {
    type: "assignment:queued" | "assignment:processing" | "assignment:completed" | "assignment:failed";
    assignmentId: string;
    payload?: AssignmentResult | { error: string };
}

export function useAssignmentSocket(assignmentId: string | null) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
    const { updateAssignment, setWsConnected, setGenerationStatus } = useAssignmentStore();

    const connect = useCallback(() => {
        if (!assignmentId) return;
        
        // Prevent multiple simultaneous connection attempts
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const ws = new WebSocket(`${WS_URL}?assignmentId=${assignmentId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("🔌 WS Connected");
            setWsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data: WsEvent = JSON.parse(event.data);
                switch (data.type) {
                    case "assignment:processing":
                        updateAssignment(assignmentId, { status: "processing" });
                        setGenerationStatus("generating");
                        break;
                    case "assignment:completed":
                        updateAssignment(assignmentId, {
                            status: "completed",
                            result: data.payload as AssignmentResult,
                        });
                        setGenerationStatus("completed");
                        break;
                    case "assignment:failed":
                        updateAssignment(assignmentId, { status: "failed" });
                        setGenerationStatus("failed");
                        break;
                }
            } catch (err) {
                console.error("WS parse error:", err);
            }
        };

        ws.onclose = (event) => {
            setWsConnected(false);
            wsRef.current = null;
            // Only reconnect if not a deliberate close (code 1000)
            if (event.code !== 1000) {
                reconnectTimer.current = setTimeout(connect, 3000);
            }
        };

        ws.onerror = (err) => {
            console.error("WS Socket Error:", err);
        };
    }, [assignmentId, updateAssignment, setWsConnected, setGenerationStatus]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
            if (wsRef.current) {
                // Use 1000 for normal closure to prevent reconnect loop during unmount
                wsRef.current.close(1000);
                wsRef.current = null;
            }
        };
    }, [connect]);
}