import { Schema, model } from 'mongoose';
import { genSalt, hash } from 'bcryptjs';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
      next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  console.log('Hashed Password during Registration:', this.password);
  next();  
});

export default model('User', userSchema);