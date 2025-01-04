import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

config();
connectDB();

const app = express();
const server = createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST']
    }
});

app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('joinDocument', (documentId) => {
        socket.join(documentId);
        console.log(`User joined document ${documentId}`);
    });
    socket.on('documentUpdate', ({ documentId, title, content }) => {
        socket.to(documentId).emit('receiveUpdate', { title, content });
    });

    socket.on('sendMessage', ({ documentId, message }) => {
        socket.to(documentId).emit('receiveMessage', message);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});