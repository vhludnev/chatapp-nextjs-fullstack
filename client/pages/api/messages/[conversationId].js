import { connectDB } from '../../../helpers/db-util';
import Message from '../../../models/MessageModel';

async function handler(req, res) {
   const conversationId = req.query.conversationId;

   // connecting to DB:
   await connectDB()

   if (req.method === 'GET') {  
      try {
         const messages = await Message.find({ conversationId })
         res.status(201).json(messages);
      } catch (err) {
         res.status(500).json({ message: 'Retrieving messages failed!' });
      }
   } 
}

export default handler;