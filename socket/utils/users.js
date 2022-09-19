const users = [];

// Check User Name
const checkUserName = (room, username, botName) => {
   const users = getRoomUsers(room);
   const nameExists = users.some(el => el.username === username) || botName.includes(username) // true/false for the user already exists
   return nameExists
}

// Join user to chat
const userJoin = (id, username, room, userId) => {
   const user = { id, username, room, userId, createdAt: Date.now() };

   users.push(user);

   return user;
}

// Get current user
const getCurrentUserBySocket = (socketId) => {
   return users.find(user => user.socketId === socketId);
}

// User leaves chat
const userLeave = (id) => {
   const index = users.findIndex(user => user.userId === id);

   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
}

// Get room users
const getRoomUsers = (room) => {
   return users.filter(user => user.room === room);
}




const addUser = (userId, socketId, name) => {
   if (!users.some(user => user.userId === userId)) {
      users.push({ 
         userId, socketId, name, activeChat: '', createdAt: Date.now()
      });
   }
};

const updateUser = (userId, activeChat, socketId) => {
   const user = users.find(user => user.userId === userId) 
   if (user) {
      user.activeChat = activeChat
      user.socketId = socketId
      user.createdAt = Date.now()
   }
   //return [...users, user]
   return user
};
 
// const removeUser = (socketId) => {
//    /* users = */return users.filter(user => user.socketId !== socketId);
// };

const removeUser = (id) => {
   /* users = */return users.filter(user => user.userId !== id);
};
 
const getUser = userId => {
   return users.find(user => user.userId === userId);
};


export { users, userJoin, getCurrentUserBySocket, userLeave, getRoomUsers, checkUserName, addUser, updateUser, removeUser, getUser };
