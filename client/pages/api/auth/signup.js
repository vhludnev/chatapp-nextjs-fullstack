import { connectDB } from '../../../helpers/db-util';
import { hashPassword } from '../../../helpers/auth-util';
import User from '../../../models/UserModel';

async function handler(req, res) {
   if (req.method !== 'POST') {
      return;
   }

   const data = req.body;

   const { email, password } = data;

   if (!email || !email.includes('@') ||
      !password || password.trim().length < 7
   ) {
      res.status(422).json({ message: 'Invalid input - password should also be at least 7 characters long.' });
      return;
   }

   // connecting to DB:
   await connectDB()

   /* checking if a user with this email has already been registered */
   const existingUser = await User.findOne({ email });
   if (existingUser) {
      res.status(422).json({ message: 'User already exists!' });
      return;
   }

   try {
      const hashedPassword = await hashPassword(password);

      const newUser = new User({ email, password: hashedPassword, name: `user-${Math.floor(Math.random() * 10000)}` })
      await newUser.save();

      const { password: pass, ...otherData } = newUser._doc

      res.status(201).json({ message: 'New user created!', user: otherData });
   } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error creating a new user accout' })
   }
}

export default handler;