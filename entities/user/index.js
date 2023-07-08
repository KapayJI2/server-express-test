import mongoose from 'mongoose';

const UserModel = new mongoose.Schema({
  id: { type: String },
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

export default mongoose.model('UserModel', UserModel);
