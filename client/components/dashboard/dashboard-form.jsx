import { useRef, useState } from 'react'
import ShowPassIcon from '../icons/show-password';
import HidePassIcon from '../icons/hide-password';

import classes from './dashboard-form.module.css';

const DashboardForm = ({ onUserDataChange, provider, name, picture }) => {
   const [showOldPassword, setShowOldPassword] = useState(false)
   const [showNewPassword, setShowNewPassword] = useState(false)
   const nameRef = useRef()
   const pictureUrlRef = useRef(picture)
   const oldPasswordRef = useRef()
   const newPasswordRef = useRef()

   const submitHandler = (event) => {
      event.preventDefault()

      const name = nameRef.current.value
      const picture = pictureUrlRef.current.value
      const oldPassword = oldPasswordRef.current?.value 
      const newPassword = newPasswordRef.current?.value

      // optional: Add validation
      onUserDataChange({ name, picture, oldPassword, newPassword })
   }

   return (
      <form className={classes.form} onSubmit={submitHandler}>
         <div className={classes.control}>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' ref={nameRef} defaultValue={name} placeholder='Enter your user name' />
         </div>
         <div className={classes.control}>
            <label htmlFor='avatar'>Photo (url)</label>
            <input type='url' id='avatar' ref={pictureUrlRef} defaultValue={picture} placeholder='Enter your image url address' />
         </div>
         {provider !== 'google' && (
            <>
            <div className={classes.control}>
               <label htmlFor='old-password'>Old Password</label>
               <input type={showOldPassword ? 'text' : 'password'} id='old-password' ref={oldPasswordRef} placeholder='Enter your old password' />
               <span className={classes.pass} onClick={() => setShowOldPassword((prevState) => !prevState)}>{showOldPassword ? <ShowPassIcon /> : <HidePassIcon />}</span>
            </div>
            <div className={classes.control}>
               <label htmlFor='new-password'>New Password</label>
               <input type={showNewPassword ? 'text' : 'password'} id='new-password' ref={newPasswordRef} placeholder='Enter your new password' />
               <span className={classes.pass} onClick={() => setShowNewPassword((prevState) => !prevState)}>{showNewPassword ? <ShowPassIcon /> : <HidePassIcon />}</span>
            </div>
            </>
         )}
         <div className={classes.action}>
            <button>Update Profile</button>
         </div>
      </form>      
   )
}

export default DashboardForm
