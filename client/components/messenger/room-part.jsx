import { useRouter } from 'next/router'
import { useContext } from "react";
import MessengerContext from '../../store/messenger-context';
import RoomIcon from '../icons/room';
import UsersIcon from '../icons/users';

import classes from './room-part.module.css';

const Room = () => {
   const router = useRouter()

   const { activeRoomUsers, currentChat, updateCurrentChat, user } = useContext(MessengerContext)

   const currentId = user?._id

   const rooms = [
      {_id: 'room1', name: 'Room 1', group: true},
      {_id: 'room2', name: 'Room 2', group: true},
      {_id: 'room3', name: 'Room 3', group: true},
      {_id: 'room4', name: 'Room 4', group: true},
      {_id: 'room5', name: 'Room 5', group: true}
   ]

   const handleClick = r => {
      if (currentId) {
         return updateCurrentChat(r)
      } else {
         router.push('/auth')
      }
   };

   return (
      <>
         {rooms?.map(r => (
            <div onClick={() => handleClick(r)} key={r._id} className={currentChat?._id === r._id ? [classes.room, classes.activeRoom].join(" ") : classes.room}>
               <RoomIcon />
               <span className={classes.roomName}>{r.name}</span>
            </div>
         ))}
         {activeRoomUsers?.length && currentChat && (
            <ul className={classes.roomUsersWrapper}>
               <span><UsersIcon /></span>
               {activeRoomUsers?.map(u => (
                  <li key={u.userId} className={classes.roomUser}>{u.name}</li>
               ))}
            </ul>
         )}
      </>
   )
}

export default Room