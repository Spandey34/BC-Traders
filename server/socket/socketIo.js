import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const server = createServer(app);

// Attach socket.io to the server
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Using plain objects instead of Maps
const userSocketMap = {};
const socketUserMap = {};

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {

    const userId = socket.handshake.query.userId;
    const userRole = socket.handshake.query.role;

    if (userId && userId !== "undefined") {
        // Add user to objects
        userSocketMap[userId] = { socketId: socket.id, role: userRole };
        socketUserMap[socket.id] = userId;
    }


    // Emit online users to admins
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        // Read from object
        const disconnectedUserId = socketUserMap[socket.id];
        if (disconnectedUserId) {
            // Delete from objects
            delete userSocketMap[disconnectedUserId];
            delete socketUserMap[socket.id];
            
            // Emit updated online users to admins
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

});

app.set('io', io);

export { app, server, io, userSocketMap };