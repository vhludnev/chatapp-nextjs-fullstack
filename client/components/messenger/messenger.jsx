import { useState, useContext, useEffect, useRef } from "react";
import Room from './room-part';
import Message from './message-part';
import ChatOnline from './chat-online-part';
import Emojis from './emojis';
import { BsEmojiSmile } from 'react-icons/bs';
import ArrowUpIcon from '../icons/arrow-up';
import MessengerContext from '../../store/messenger-context';

import classes from './messenger.module.css';

const Messenger = () => {
  const [receiverName, setReceiverName] = useState(null)
  const textareaRef = useRef();
  const scrollRef = useRef();
  const feedbackRef = useRef();
  
  const elem = textareaRef.current

  const { handleMessageSubmit, socket, user, users, showEmojis, toggleEmoji, typingMsg, currentChat, messages } = useContext(MessengerContext)
  
  useEffect(() => {
    // update placeholder text
    if (!currentChat?.group) {
      const rId = currentChat?.members.find(el => el !== user._id)
      const receiver = users?.find(u => u._id === rId)
      setReceiverName(receiver?.name)
    } else {
      setReceiverName(null)
    }

    // typing event hanlers
    const handleTyping = () => {
      return socket.current.emit('typing', ({ name: user.name, chatId: currentChat?._id, id: currentChat?.members && currentChat?.members.find(m => m !== user._id), room: currentChat?._id }))
    }
    const handleBlur = () => {
      return socket.current.emit('typing', ({ clearMsg: true, id: currentChat?.members && currentChat?.members.find(m => m !== user._id), room: currentChat?._id }))
    }

    if (currentChat) {
      elem?.addEventListener('keypress', handleTyping)
      elem?.addEventListener('blur', handleBlur)
      return () => { 
        elem?.removeEventListener('keypress', handleTyping) 
        elem?.removeEventListener('blur', handleBlur) 
      }
    }
  }, [currentChat])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    if (typingMsg) {
      feedbackRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [messages, typingMsg]);

  const addEmoji = (data) => {
    elem.value += `${data} `
    toggleEmoji()
  }

  const AutoGrow = () => {
    elem.style.height = "44px";
    elem.style.height = elem.scrollHeight + "px";
  }

  return (
    <>
      <div className={classes.messenger}>
        <div className={classes.chatMenu}>
          <div className={classes.chatMenuWrapper}>
            <Room />
          </div>
        </div>
        <div className={classes.chatBox}>
          <div className={classes.chatBoxWrapper}>         
            <>
              <div className={classes.chatBoxTop}>
                {user && currentChat && messages.map((m, idx) => (
                  <div ref={scrollRef} key={idx}>
                    <Message message={m} own={m.sender === user._id} bot={m.sender} sender={users.find(u => u._id === m.sender)} />
                  </div>
                ))}
                <p ref={feedbackRef}>{typingMsg}</p>
              </div>     
              {showEmojis && <span className={classes.chatMessageEmojisWrapper}><Emojis addEmoji={addEmoji} /></span>}   
              <div className={currentChat ? classes.chatBoxBottom : [classes.chatBoxBottom, classes.disabled].join(" ")}>  
              
                <div className={classes.chatMessageInputWrapper}>
                  <textarea
                    ref={textareaRef}
                    maxLength={150}
                    className={classes.chatMessageInput}
                    placeholder={receiverName ? `write something to ${receiverName}` : "write something..."}
                    onInput={AutoGrow}
                  ></textarea>
                  <BsEmojiSmile color='orange' size={26} onClick={toggleEmoji} />
                </div>
                <button className={classes.chatSubmitButton} onClick={(e) => handleMessageSubmit(e, elem)}>
                  Send
                </button>
              </div>
            </>      
            {user && !currentChat && (
              <>
                <span className={classes.arrow}><ArrowUpIcon /></span>
                <span className={classes.noConversationText}>
                  Open a conversation to start a chat.
                </span>
              </>
            )}
            {!user && (
              <>
                <span className={classes.arrow}><ArrowUpIcon /></span>
                <span className={classes.noConversationText}>
                  Please log in to start chating.
                </span>
              </>
            )}
          </div>
        </div>
        <div className={classes.chatOnline}>
          <div className={classes.chatOnlineWrapper}>
            <ChatOnline/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger