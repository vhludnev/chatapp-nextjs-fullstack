import { useContext } from 'react';
import MainHeader from './main-header';
import Footer from './footer';
import Notification from '../ui/notification';
import NotificationContext from '../../store/notification-context';

const Layout = ({ children }) => {
   const { notification: activeNotification } = useContext(NotificationContext);

   return (
      <>
         <MainHeader />
         <main>{children}</main>
         {activeNotification && (
            <Notification
               title={activeNotification.title}
               message={activeNotification.message}
               status={activeNotification.status}
            />
         )}
         <Footer />
      </>
   );
}

export default Layout;