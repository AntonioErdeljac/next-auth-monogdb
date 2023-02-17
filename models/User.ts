import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: {
    type: String,
    required: true,
    minLength: 5,
  },
  image: {
    type: String,
  }
});

const User = mongoose.models.User || mongoose.model('User', Schema);

export default User;
