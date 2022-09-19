import { Schema, model, models } from 'mongoose';

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = models.Conversation || model('Conversation', ConversationSchema, 'conversations');

export default Conversation;