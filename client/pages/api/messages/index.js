import { connectDB } from '../../../helpers/db-util';
import Message from '../../../models/MessageModel';

async function handler(req, res) {
   // connecting to DB:
   await connectDB()

   if (req.method === 'POST') {
      const newMessage = new Message(req.body)
      // adding data to DB:
      try {
         const savedMessage = await newMessage.save();
         res.status(201).json(savedMessage, { message: 'Success! Message sent.' });
      } catch (err) {
         res.status(500).json({ message: 'Posting message failed!' });
      }
   }
}

export default handler;