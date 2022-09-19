import axios from 'axios';
import { createContext, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { io } from "socket.io-client";

const MessengerContext = createContext()

export const MessengerContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null);
  const [updateUsers, setUpdateUsers] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [envelopes, setEnvelopes] = useState([]);
  const [activeRoomUsers, setActiveRoomUsers] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingMsg, setTypingMsg] = useState(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const socket = useRef();

  const { data: session } = useSession();
  const router = useRouter()

  useEffect(() => {
    setUser(session?.user)
  }, [session])

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get("/api/");
      setUsers(res.data);
    };  
    getUsers();
    setUpdateUsers(false)
  }, [updateUsers]);

  useEffect(() => {
    if (user) {
      //socket.current = io("ws://localhost:8000");         /* `ws://${window.location.hostname}:5000` */
      socket.current = io(process.env.ENDPOINT);

      socket.current.emit('addUser', { userId: user._id, name: user.name }, (/* data */) => {
        // console.log(data);
      });

      socket.current.on('message', data => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          room: data.chatRoom,
          createdAt: data.createdAt,
        });
      });

      // Check if new user registered and signed in
      socket.current.on('checkIfNew', userId => {
        const existingUser = users.find(u => u._id === userId)
        if (!existingUser) {
          setUpdateUsers(!updateUsers)
        }
      })

      // Get room and users
      socket.current.on('roomsUsers', usersOnline => {
        const chatUser = usersOnline.find(u => u.userId === user._id)
        setActiveRoomUsers(usersOnline.filter(user => user.activeChat === chatUser.activeChat));
        setOnlineUsers([...usersOnline]);
      });

      // Sending new user info to others after profile update
      socket.current.on('userUpdated', ({ userId, name, picture }) => {
        const userToUpdate = users.find(u => u._id === userId)
        const { name: nameBeforeUpdate, picture: picBeforeUpdate, ...other } = userToUpdate

        setUsers(users => [...users.filter(u => u._id !== userId), { name, picture, ...other }].sort((a, b) => a.name.localeCompare(b.name)))
      })

      // Typing message process
      socket.current.on('typing', data => {
        if (data && data !== user.name) {
          setTypingMsg(`${data} is typing a message...`)
        } else {
          setTypingMsg(null)
        }
      })

      socket.current.on('removeUser', userId => {
        setUsers(users => users.filter(user => user._id !== userId))
      })
    }
  }, [user]);

  useEffect(() => {
    if (arrivalMessage) {
      if (currentChat?.members?.includes(arrivalMessage.sender) || currentChat?._id === arrivalMessage.room) {
        setMessages(prev => [...prev, arrivalMessage]);
      }
    }  
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (user) {
      if (currentChat?.group) {
        setMessages(messages);
      } else {
        const getMessages = async () => {
          try {
            const res = await axios.get("/api/messages/" + currentChat?._id);
            setMessages(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
      }
    }
  }, [currentChat]);

  useEffect(() => {
    if (user) {
      socket.current.on("alert", ({ senderId, chatId, createdAt }) => {
        setEnvelopes([...envelopes, { senderId, chatId, createdAt }])
      })
    }
  }, [currentChat])


  const handleMessageSubmit = async (e, input) => {
    e.preventDefault();
    if (user && input?.value.length > 0) { 
      const message = {
        sender: user._id,
        text: input?.value,
        conversationId: currentChat?._id,
      }; 

      if (currentChat?.group) {
        socket.current.emit("sendMessage", {
          senderId: user._id,
          chatRoom: currentChat?._id,
          text: input?.value,
        });
      } else {
        const receiverId = currentChat.members?.find(member => member !== user._id);

        socket.current.emit("sendMessage", {
          senderId: user._id,
          chatRoom: currentChat._id,
          receiverId,
          text: input?.value,
        });

        const receiverOnline = onlineUsers.find(u => u.userId === receiverId)

        if (receiverOnline && (receiverOnline.activeChat === '' || receiverOnline.activeChat !== currentChat._id)) {
          socket.current.emit('alertNewMsg', { 
            senderId: user._id, 
            receiverSocketId: receiverOnline.socketId, 
            chatId: currentChat._id 
          })  
        } 
      }

      try {
        if (!currentChat?.group) {       
          const res = await axios.post("/api/messages", message);
          setMessages([...messages, res.data]);
        }
      } catch (err) {
        console.log(err);
      }
      input.value = ''
      input.style.height = "44px";
      setShowEmojis(false)
      //e.target.reset()
    }
  };

  const updateMessages = (data) => {
    setMessages([...messages, data]);
  }

  const updateCurrentChat = (chatData) => {
    if (user) {
      socket.current.emit('roomLeave', { id: user._id })
    }
    setCurrentChat(chatData)
    socket.current?.emit('updateUserChat', { id: user._id, activeChat: chatData?._id })

    if (chatData?.group) {
      socket.current.emit('joinRoom', { /* username: user.name, */ room: chatData, userId: user._id })
      console.log(`${user.name} has joined the Chat Pro "${chatData.name}"`);
      socket.current.emit('receiver', { room: chatData })
      socket.current.on('roomMessages', ({ messagesArchive }) => {
        return setMessages(messagesArchive)
      })
    }

    const removeAlert = envelopes.find(el => el.chatId === chatData._id && el.senderId !== user._id)
    if (removeAlert) {
      setEnvelopes(envelopes.filter(el => el !== removeAlert))
    }
    setShowEmojis(false)
    router.pathname !== '/' && router.push('/', undefined, { shallow: true })
  }

  const toggleEmoji = () => {
    setShowEmojis(!showEmojis)
  }

  const updateUserInfo = ({ name, picture }) => {
    socket.current.emit('updateUserProfile', { userId: user._id, name, picture })
  }

  const changeUsersList = userId => {
    socket.current.emit('removeUserFromList', userId)
  }
  

  const context = { 
    socket,
    user,
    users,
    onlineUsers,
    activeRoomUsers,
    currentChat,
    updateMessages,
    updateUserInfo,
    typingMsg,
    messages,
    envelopes,
    arrivalMessage,
    toggleEmoji,
    showEmojis,
    updateCurrentChat,
    handleMessageSubmit,
    changeUsersList
  };
   
  return (
    <MessengerContext.Provider value={context}>
      {children}
    </MessengerContext.Provider>
  );
}

export default MessengerContext;