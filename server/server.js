const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let listeners = 247;
const liveMessages = [
  { name: 'Station', text: 'Welcome to GWM Radio Network live comments.' },
];

app.get('/', (_req, res) => {
  res.send('GWM Radio backend is running.');
});

app.get('/api/status', (_req, res) => {
  res.json({
    station: 'GWM Radio Network',
    ministry: 'Genesis Worship Ministry',
    live: true,
    listeners,
  });
});

app.get('/api/messages', (_req, res) => {
  res.json(liveMessages);
});

io.on('connection', (socket) => {
  listeners += 1;
  io.emit('listeners:update', { count: listeners });

  socket.on('chat:message', (payload) => {
    const clean = {
      name: String(payload?.name || 'Listener').slice(0, 40),
      text: String(payload?.text || '').slice(0, 280),
    };

    if (!clean.text.trim()) return;
    liveMessages.push(clean);
    io.emit('chat:message', clean);
  });

  socket.on('disconnect', () => {
    listeners = Math.max(1, listeners - 1);
    io.emit('listeners:update', { count: listeners });
  });
});

const port = process.env.PORT || 4242;
server.listen(port, () => {
  console.log(`GWM Radio backend listening on http://localhost:${port}`);
});
