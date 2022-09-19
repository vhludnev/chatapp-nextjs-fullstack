import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = models.Message || model('Message', MessageSchema, 'messages');

export default Message;