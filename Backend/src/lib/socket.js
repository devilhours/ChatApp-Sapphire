import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chatapp-sapphire-frontend.onrender.com",
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- NEW: LISTEN FOR TYPING EVENTS ---
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping");
    }
  });

  // --- NEW: LISTEN FOR MARK AS SEEN EVENT ---
  socket.on("markAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { senderId: conversationId, receiverId: userId, seen: false },
        { $set: { seen: true } }
      );
      
      const senderSocketId = getReceiverSocketId(conversationId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { conversationId: userId });
      }
    } catch (error) {
      console.log("Error in markAsSeen event: ", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
