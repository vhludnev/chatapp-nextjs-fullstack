import { connectDB } from '../../../helpers/db-util';
import User from '../../../models/UserModel';

async function handler(req, res) {
   const userId = req.query.userId;

   // connecting to DB:
   await connectDB()

   if (req.method === 'GET') {  
      try {
         const user = await User.findOne({ _id: userId })
         const { password, /* provider, role,  */...other } = user._doc;
         res.status(201).json(other);
      } catch (err) {
         res.status(500).json({ message: 'Could not fetch the user! Try again later.' });
      }
   } else if (req.method === 'DELETE') {
      try {
         await User.deleteOne({ _id: userId })
         res.status(201).json({ message: 'User removed' });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong! Try again later.'});
      }
   }
}

export default handler;