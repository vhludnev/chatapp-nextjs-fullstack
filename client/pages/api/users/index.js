import { connectDB } from '../../../helpers/db-util';
import User from '../../../models/UserModel';

async function handler(req, res) {
   // connecting to DB:
   await connectDB()

   if (req.method === 'GET') {  
      try {
         const arr = []
         const users = await User.find({})
         users.forEach(user => {
            const { password, provider, role, ...other } = user._doc;
            arr.push(other)
         })
         res.status(201).json(arr);
      } catch (err) {
         res.status(500).json({ message: 'Could not fetch all users! Try again later.' });
      }
   } 
}

export default handler;