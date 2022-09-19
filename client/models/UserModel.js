import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  id: {
    type: /* Schema.Types.ObjectId, */ String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  provider: {
    type: String,
    required: true,
    default: 'credentials'
  },
  name: {
    type: String,
    required: false,
    min: 3,
    max: 20,
    unique: true,
    default: ''
  },
  picture: {
    type: String,
    required: false,
    default: ''
  },
  role: {
    type: String,
    required: true,
    default: 'USER'
  }
});

const User = models.User || model('User', UserSchema, 'users');

export default User;
