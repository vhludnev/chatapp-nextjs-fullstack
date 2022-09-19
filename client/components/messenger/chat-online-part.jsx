import axios from "axios";
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from "react";
import Image from 'next/image';
import { BiEnvelope } from 'react-icons/bi';
//import NoImageIconStr from '../icons/noimagestr';
import MessengerContext from '../../store/messenger-context';

import classes from './chat-online-part.module.css';

const ChatOnline = () => {
  const [filteredNames, setFilteredNames] = useState([]);
  const router = useRouter()

  const { currentChat, onlineUsers, user, updateCurrentChat, envelopes, users } = useContext(MessengerContext)

  useEffect(() => {
    setFilteredNames(users)
  }, [users]);

  const handleClick = async (clickedUser) => {
    if (user) {
      try {
        const res = await axios.get(
          `/api/conversations/find?first=${user._id}&second=${clickedUser._id}`
        );
        if (res.data) {
          return updateCurrentChat(res.data);
        } else {
          try {
            const data = {
              senderId: user._id,
              receiverId: clickedUser._id
            }
            const newConversation = await axios.post(
              `/api/conversations`, data
            );
            return updateCurrentChat(newConversation.data);
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      router.push('/auth')
    }
  };

  const onlineBadge = useCallback((o) => {
    return onlineUsers.find(el => el.userId === o._id)
  }, [onlineUsers])

  const activeChat = (o) => {
    return currentChat?.members?.find(m => m === o._id)
  }

  const searchUserDb = (e) => {
    const input = e.target.value;
    const names = users?.filter(user => user.name.toLowerCase().includes(input.toLowerCase()))
    setFilteredNames(names)
  }

  // const toBase64 = (str) =>
  // typeof window === 'undefined'
  //   ? Buffer.from(str).toString('base64')
  //   : window.btoa(str)

  return (
    <>
      <input placeholder="Search for friends" onChange={searchUserDb} className={classes.chatMenuInput} />
      <div className={classes.chatOnline}>
        {filteredNames?.map((o) => (
          <div className={classes.chatOnlineFriend} style={o._id === user?._id ? {display: 'none'} : {dispay: 'block'}} key={o._id} onClick={() => handleClick(o)}>
            {envelopes.find(e => e.senderId === o._id) && <BiEnvelope color='green' size={20} />}
            <div className={classes.chatOnlineImgContainer}>
              <Image
                src={
                  o?.picture
                    ? o.picture
                    : "/images/noimage.jpg"
                }
                width={26}
                height={26}
                // placeholder='blur' 
                // blurDataURL={`data:image/svg+xml;base64,${toBase64(NoImageIconStr)}`}
                alt=""
              />
              {user && <div className={classes.chatOnlineBadge} style={{backgroundColor: onlineBadge(o) ? 'limegreen': 'var(--light-grey)'}}></div>}
            </div>
            <span className={activeChat(o) ? [classes.chatOnlineName, classes.chatActive].join(" ") : classes.chatOnlineName}>{o.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatOnline