import { io } from 'socket.io-client';

// Connect to the backend Socket.IO server
const socket = io('/', { transports: ['websocket'] });

export default socket;