import { connectDB } from '../../../helpers/db-util';
import Conversation from '../../../models/ConversationModel';

async function handler(req, res) {
   const firstUserId = req.query.first;
   const secondUserId = req.query.second;

   // connecting to DB:
   await connectDB()

   if (req.method === 'GET') {  
      try {
         const conversation = await Conversation.findOne({
            members: { $all: [firstUserId, secondUserId]}
         })
         res.status(201).json(conversation);
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong! Try again later.' });
      }
   } 
}

export default handler;