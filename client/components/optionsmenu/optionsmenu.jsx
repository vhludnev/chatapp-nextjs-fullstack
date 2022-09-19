import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useContext } from 'react';
import SignOutIcon from "../icons/sign-out-circle";
import SignInIcon from '../icons/sign-in-circle';
import ChatOnline from '../messenger/chat-online-part';
import Room from '../messenger/room-part';
import MessengerContext from '../../store/messenger-context';

import classes from './optionsmenu.module.css';

const MenuNav = () => {
   const { socket, user } = useContext(MessengerContext)
   const router = useRouter();

   const logoutHandler = () => {
      socket.current.close()
      signOut({ callbackUrl: '/auth' });
   }

   return (
     <div className={classes.dropdown}>
         {user && (
         <ul>
            <li>
               <Link href='/dashboard'>Profile</Link>
               <hr style={{color: 'grey', margin: '15px 0 0'}}/>
            </li>
         </ul>
         )}
         <div className={classes.mobile}>
            <Room />
            <hr style={{color: 'grey', margin: '15px 0'}}/>
            <ChatOnline />
            <hr style={{color: 'grey', margin: '15px 0 0'}}/>
         </div>
         <li>
         {user 
            ? <button onClick={logoutHandler}><SignOutIcon/></button>
            : <button onClick={() => router.push('/auth')}><SignInIcon /></button>
         }
         </li>
     </div>
   )
}

export default MenuNav