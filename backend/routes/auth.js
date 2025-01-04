import { Router } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User, { findOne } from '../models/User';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save(); 
    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ username: user.username,token:token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email' });
    }
    const isMatch = await compare(password, user.password);
    console.log('Password Match:', isMatch); 
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }


    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ username: user.name,token:token });
    console.log(user.name)
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;