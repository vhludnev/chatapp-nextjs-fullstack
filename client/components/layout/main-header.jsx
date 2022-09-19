import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useContext, useEffect } from 'react';
import LazyImage from '../ui/lazy-image';
import OptionsMenu from '../optionsmenu/optionsmenu';
import RoomIcon from '../icons/room';
import MessengerContext from '../../store/messenger-context';

import classes from './main-header.module.css';

const MainHeader = () => {
   const [dropdown, setDropdown] = useState(false);
   const ref = useRef();
   const { data: session } = useSession();

   const { updateCurrentChat } = useContext(MessengerContext)

   const toggleDropdown = () => {
      setDropdown(!dropdown)
   }

   const handleClick = () => {
      if (window.location.pathname === '/') {
         updateCurrentChat(null)
      }
   };

   useEffect(() => {
      const handler = (event) => {
         if (dropdown && ref.current && !ref.current.contains(event.target)) {
            toggleDropdown();
         }
      };
      document.addEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler);
      return () => {
         // Cleanup the event listener
         document.removeEventListener("mousedown", handler);
         document.removeEventListener("touchstart", handler);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dropdown]);

   return (
      <header className={classes.header}>
         <div className={classes.logo}>
            <Link href='/' shallow={true}>
               <a onClick={handleClick}>Chat Pro</a>
            </Link>
         </div>
         <nav className={classes.navigation}>
            <div>
               <span className={classes.auth} onClick={toggleDropdown} ref={ref} >
                  {session?.user ? 
                     <LazyImage 
                        className={classes.portrait}  
                        src={session?.user?.picture || '/images/noimage.jpg'} 
                        alt='portrait' 
                        width={30} 
                        height={30}
                     /> : 
                     <RoomIcon />
                  }
                  {dropdown && <OptionsMenu />}
               </span>                 
            </div>
         </nav>
      </header>
   );
}

export default MainHeader;