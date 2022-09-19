import { connectDB } from '../../../helpers/db-util';
import Conversation from '../../../models/ConversationModel';

async function handler(req, res) {
   const userId = req.query.userId;

   // connecting to DB:
   await connectDB()

   if (req.method === 'GET') {  
      try {
         const conversation = await Conversation.find({
            members: { $in: [userId]}
          })
         res.status(201).json(conversation);
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong! Try again later.' });
      }
   } 
}

export default handler;