import { getSession } from 'next-auth/react';
import { hashPassword, verifyPassword } from '../../../helpers/auth-util';
import { connectDB } from '../../../helpers/db-util';
import User from '../../../models/UserModel';

async function handler(req, res) {
   if (req.method !== 'PATCH') {
      return;
   }

   const session = await getSession({ req: req });

   if (!session) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
   }

   const email = session.user.email;
   const { name, picture, oldPassword, newPassword } = req.body

   if (newPassword && newPassword.trim().length < 7) {
      res.status(422).json({ message: 'Password should be at least 7 characters long.' });
      return;
   }

   // connecting to DB:
   await connectDB()

   const user = await User.findOne({ email });

   /* just in case */
   if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
   }

   /* check if user name entered */
   if (user && !name) {
      res.status(404).json({ message: 'Please enter your user name!' });
      return;
   }

   /* check if this user name already exists */
   if (user && name) {
      if (name.length > 20) {
         res.status(404).json({ message: 'Username must have max 20 characters!' });
         return;
      }

      const userByName = await User.findOne({ name });
      if (userByName && userByName._id.toString() !== user._id.toString()) {
         res.status(404).json({ message: 'User with this username already exists!' });
         return;
      }
   }

   /* check if user entered new data */
   if (user && !oldPassword && !newPassword && name === user.name && picture === user.picture) {
      res.status(404).json({ message: 'Please enter new user info first!' });
      return;
   }

   if (newPassword && oldPassword) {
      const currentPasswordDb = user.password;
      const oldPasswordCheck = await verifyPassword(oldPassword, currentPasswordDb);

      if (!oldPasswordCheck) {
         res.status(422).json({ message: 'Invalid old password.' });
         return;
      } else {
         const hashedPassword = await hashPassword(newPassword);

         //  INFO:  { $set: { password: hashedPassword, name, picture } } // add { $unset: [ "field1", "field2" ] } to remove fields do not need
         const userUpdated = await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword, name, picture: user?.picture === picture ? picture: `https://res.cloudinary.com/demo/image/fetch/${picture}`} } // add { $unset: [ "field1", "field2" ] } to remove fields do not need
         );
         const { password, ...otherData } = userUpdated._doc;
         res.status(200).json(otherData/* , { message: 'User data updated!' } */);
      }
   } else if ((!newPassword && !oldPassword ) && (name || picture)) {
      const userUpdated = await User.findOneAndUpdate(
         { email },
         { $set: { name, picture: user?.picture === picture ? picture: `https://res.cloudinary.com/demo/image/fetch/${picture}` } }
      );
      const { password, ...otherData } = userUpdated._doc;
      res.status(200).json(otherData/* , { message: 'User data updated!' } */);
   } else {
      res.status(422).json({ message: 'Check your inputs' });
   }
}

export default handler;