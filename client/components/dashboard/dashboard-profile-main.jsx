import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import MessengerContext from '../../store/messenger-context';
import NotificationContext from '../../store/notification-context';
import DashboardForm from './dashboard-form';

import classes from './dashboard-profile-main.module.css';

const UserProfileMainScreen = () => {
   const router = useRouter()
   const { showNotification } = useContext(NotificationContext)
   const { updateUserInfo, user } = useContext(MessengerContext)

   const changeUserDataHandler = async (userDataToUpdate) => {
      showNotification({
         title: 'Updating...',
         message: 'Updating User Data.',
         status: 'pending',
      })

      try {
         const { data } = await axios.patch('/api/auth/update-user-data', userDataToUpdate)
         if (data) {
            showNotification({
               title: 'Success!',
               message: 'User Data updated!',
               status: 'success',
            })
            updateUserInfo({ name: userDataToUpdate.name, picture: userDataToUpdate.picture });
            router.reload()
         } else {
            showNotification({
               title: 'Error!',
               message: data.message || 'Something went wrong!',
               status: 'error',
            })
         }
      } catch (err) {
         console.log(err);
         showNotification({
            title: 'Error!',
            message: err.response.data.message || 'Please check your input data!',
            status: 'error',
         })
      }   
   }

   return (
      <ul className={classes.list}>
         <DashboardForm 
            onUserDataChange={changeUserDataHandler} 
            provider={user?.provider} 
            name={user?.name} 
            picture={user?.picture} 
         />
      </ul>
   )
}

export default UserProfileMainScreen;