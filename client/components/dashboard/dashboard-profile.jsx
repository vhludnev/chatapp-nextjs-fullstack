import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useContext } from 'react';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import LazyImage from '../ui/lazy-image';
import MessengerContext from '../../store/messenger-context';

import classes from './dashboard-profile.module.css';

const UserDashboardProfile = () => {
  const { user, changeUsersList } = useContext(MessengerContext)

  const deleteUser = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await axios.delete("/api/users/" + user._id);
        return changeUsersList(user._id)
      } catch (err) {
        console.log(err);
      } finally {
        signOut({ callbackUrl: '/auth' });
      }
    }
  }

  return (
    <section className={classes.profile}>
      <h1>User Profile</h1>
      <LazyImage 
        src={user?.picture || '/images/noimage.jpg'} 
        width={100} 
        height={100}
        alt='portrait'
      />
      {user?.name && <p style={{fontWeight: 'bold'}}>{user?.name}</p>}
      <p>{user?.email}</p>
      <button onClick={deleteUser}><RiDeleteBin5Fill color='red' size={24} /></button>
    </section>
  );
}

export default UserDashboardProfile;
