const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const uuid = require('uuid/v4');



const rooms = {};

io.on('connection', (socket) => {
  socket.on('user_join', (name, room) => {
    let room = null;
    if (Object.keys(rooms).length === 0) {
      room = uuid();
      rooms[room] = {};
      rooms[room][players] = [socket.id];
      rooms[room][id] = room;
      socket.join(room);
    } else {
      for (let r in rooms) {
        if (rooms[r].length === 1) {
          room = r;
          rooms[room][players].push(socket.id);
          socket.join(room);
        }
      }
      if (!room) {
        room = uuid();
        rooms[room] = {};
        rooms[room][players] = [socket.id];
        rooms[room][id] = room;
        socket.join(room);
      }
    }
    socket.roomId = room;
    socket.userName = name;
    io.to(room).emit('user_join', room, socket.id);
    console.log('a user connected', room, socket.id);
  });

  socket.on('user_ready', (roomId, userId) => {
    if (!rooms[roomId][ready]) {
      rooms[roomId][ready] = [];
    }
    rooms[roomId][ready].push(userId);
    io.to(roomId).emit('user_ready', roomId, userId);
  });

  socket.on('user_unready', (roomId, userId) => {
    rooms[roomId][ready] = rooms[roomId][ready].filter((id) => id !== userId);
    io.to(roomId).emit('user_unready', roomId, userId);
  });

  socket.on('user_start', (roomId) => {
    io.to(roomId).emit('user_start', roomId);
  });

  socket.on('user_move', (roomId, userId, move) => {
    io.to(roomId).emit('user_move', roomId, userId, move, score);
  });

  socket.on('user_win', (roomId, userId) => {
    io.to(roomId).emit('user_win', roomId, userId);
  });

  socket.on('disconnect', () => {
    let roomId = socket.roomId;
    rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
    io.to(roomId).emit('user_disconnet', roomId, socket.id);
    socket.leave(roomId);
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
    socket.roomId = null;
    console.log('user disconnected', roomId, socket.id);
  });
})

server.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});