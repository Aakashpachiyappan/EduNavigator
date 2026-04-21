import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      // Disconnect existing socket when logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    // Connect and join personal room
    const s = io("http://localhost:5500", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    s.on("connect", () => {
      console.log("🔌 Socket connected:", s.id);
      s.emit("join", user._id);
    });

    s.on("connect_error", (err) => {
      console.warn("Socket connect error:", err.message);
    });

    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
