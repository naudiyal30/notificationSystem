// Install dependencies: npm install express socket.io cors

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());

let notifications = [];

// REST API to send a notification
app.post('/notify', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    const notification = { id: Date.now(), message };
    notifications.push(notification);
    io.emit('notification', notification);
    
    res.json({ success: true, notification });
});

// REST API to get all notifications
app.get('/notifications', (req, res) => {
    res.json(notifications);
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.emit('init', notifications);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
