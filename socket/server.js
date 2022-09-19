import { Server } from 'socket.io';
import express from 'express';
import * as http from 'http';
import cors from 'cors';
import * as dotenv from 'dotenv'
import { users, getCurrentUserBySocket,  userLeave, addUser, updateUser, getUser  } from './utils/users.js';

dotenv.config()
// Server setup
const app = express()
const server = http.createServer(app)
const options = {
    maxHttpBufferSize: 1e8,  // 100 Mb,
    cors: {
       origin: /* 'http://localhost:3000', */ '*',
       //method: ['GET', 'POST']
    }
}

app.get('/', (req, res) => res.send({ response: "Server is up and running." }).status(200))
app.use(cors());

// Socket setup & pass server
const io = new Server(server, options)

const messagesArr = []
io.on('connection', (socket) => {
   //take userId and socketId from user
   socket.on('addUser', ({ userId, name}, cb) => {
     addUser(userId, socket.id, name);
     io.emit('roomsUsers', users);
     //when connected
     console.log(`a user ${socket.id} connected.`);
     cb('user connected')
     io.emit('checkIfNew', userId)
   });

   //join room chat
   socket.on('joinRoom', ({ /* username, */ room, userId }) => {
      // const user = userJoin(socket.id, username, room, userId )
      const user = getUser(userId)
      if (user) {
         socket.join(room._id);     
         // Welcome message to a current user
         socket.emit('message', { chatRoom: room._id, text: `Welcome to Chat ${room.name} !`, createdAt: Date.now() })

         // Broadcast to room members when a new user connects
         socket.broadcast
            .to(room._id)
            .emit('message', { chatRoom: room._id, text: `${user.name} has joined the chat`, createdAt: Date.now() })
      }
   })

   socket.on('removeUserFromList', userId => { 
      io.emit('removeUser', userId) 
   })
   
   //listen for group/private chat messages
   socket.on("sendMessage", ({ senderId, receiverId, chatRoom, text }) => {
      if (receiverId) {
         const user = getUser(receiverId);
         if (user.activeChat === chatRoom) {
            io.to(user.socketId).emit("message", { senderId, text, chatRoom, createdAt: Date.now() })
         }
      } else {  
         messagesArr.push({ sender: senderId, text, room: chatRoom, createdAt: Date.now() })
         io.to(chatRoom).emit('message', { senderId, chatRoom, text, createdAt: Date.now() })
      }
   });

   socket.on('alertNewMsg', ({ senderId, receiverSocketId, chatId }) => {
      socket.to(receiverSocketId)
            .emit('alert', { senderId, chatId, createdAt: Date.now() })
   })

   //handle typing event 
   socket.on('typing', ({ name, chatId, id, room, clearMsg }) => {
      const receiver = getUser(id)

      if (clearMsg && (receiver || room)) {  
         return socket.broadcast.to(id ? receiver?.socketId : room).emit('typing', '')               
      } else if (id && receiver?.activeChat === chatId) {
         socket.broadcast.to(receiver?.socketId).emit('typing', name)                                                   // for private chat messaging                  
      } else if (room) {                                                                   
         users.filter(u => u.activeChat === room).forEach(s => socket.broadcast.to(s.socketId).emit('typing', name))    // transmit to all active room members
      }
   })

   // update currentChat
   socket.on('updateUserChat', ({ id, activeChat }) => {
      updateUser(id, activeChat, socket.id)
      io.emit('roomsUsers', users);
   })

   // update currentChat
   socket.on('updateUserProfile', ({ userId, name, picture }) => {
      io.emit('userUpdated', { userId, name, picture });
   })

   //handle receiving messages from an array of group chat
   socket.on('receiver', ({ room }) => {
      socket.emit('roomMessages', { messagesArchive: messagesArr.filter(m => m.room === room._id) })
   })

   socket.on('roomLeave', ({ id: userId }) => {
      const user = getUser(userId)
      if (user) {
         socket.leave(user.activeChat)
         socket.broadcast.to(user.activeChat).emit('message', { chatRoom: user.activeChat, text: `${user.name} has left the chat room`, createdAt: Date.now() });
         io.emit('roomsUsers', users);
      }
   })
 
   //when disconnect
   socket.on('disconnect', () => {
      const user = getCurrentUserBySocket(socket.id)

      if (user) {
         console.log(`a user ${socket.id} disconnected!`);
         io.to(user.activeChat).emit('message', { chatRoom: user.activeChat, text: `${user.name} has left Chat pro`, createdAt: Date.now() } );
         userLeave(user.userId)
         io.emit('roomsUsers', users);
      }
   });
});
 

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`listening for requests on port ${PORT},`))
