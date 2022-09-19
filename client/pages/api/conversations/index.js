import { connectDB } from '../../../helpers/db-util';
import Conversation from '../../../models/ConversationModel';

async function handler(req, res) {
   // connecting to DB:
   await connectDB()

   if (req.method === 'POST') {
      const newConversation = new Conversation({
         members: [req.body.senderId, req.body.receiverId]
      })

      // adding data to DB:
      try {
         const savedConversation = await newConversation.save();
         res.status(201).json(savedConversation, { message: 'Success! Conversation created.' });
      } catch (err) {
         res.status(500).json({ message: 'Creating conversation failed!' });
      }
   }
}

export default handler;