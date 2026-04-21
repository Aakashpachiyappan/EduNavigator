import { Server } from "socket.io";

let io;

const allowedOrigins = [
  "https://ephemeral-daffodil-28e8d0.netlify.app",
  "https://warm-frangollo-91690f.netlify.app",
  "https://astonishing-tarsier-522f3e.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Client identifies itself by userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized yet");
  return io;
}
