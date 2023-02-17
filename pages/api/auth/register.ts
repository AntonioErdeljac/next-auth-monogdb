import bcrypt from 'bcrypt';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { email, username, password } = req.body;

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: username,
      email,
      hashedPassword
    });

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}