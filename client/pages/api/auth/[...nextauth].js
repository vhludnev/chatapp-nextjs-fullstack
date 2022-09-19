/* handling multiple routes auto created by Next Auth  (example: api/auth/signout, api/auth/session, etc) */
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from '../../../models/UserModel';

import { connectDB } from '../../../helpers/db-util';
import { verifyPassword } from '../../../helpers/auth-util';

export default NextAuth({
   session: {
      strategy: 'jwt',                          // defines if user auth is managed by JWT (optional, default: true)
      maxAge: 30 * 24 * 60 * 60,                // t.i. 30 days (optional) - how long until an idle session expires and is no longer valid
   },
   secret: process.env.SECRET,
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider({
         async authorize(credentials, req) {

            // connecting to DB:
            await connectDB()
            const user = await User.findOne({ email: credentials.email });

            if (user?.provider === 'google') {
               throw new Error('Please use Google Sign in!');
            }

            if (!user) {
               // If you return null then an error will be displayed advising the user to check their details.
               // return null;
               throw new Error('Please check your email!');
            } else {
               const isValid = await verifyPassword(credentials.password, user.password);
        
               if (!isValid) {
                  throw new Error('Could not log you in!');
               }

               return { email: user.email };
              // return user; /* will include also password and _id of the user */
            }
         }
      })
   ],
   callbacks: {
      async signIn({ account, profile }) {
         if (account.provider === "google") {
            const { name, picture, email } = profile

            await connectDB()
            const user = await User.findOne({ email })

            if (!user) {
               /* check if this user name already exists */
               const userWithThisNameExists = await User.findOne({ name });
               const convertedName = data => {
                  const newName = data.toLowerCase().split(' ').join('_')
                  return `${newName}-${Math.floor(Math.random() * 10000)}`
               }

               try {
                  const newUser = new User({ 
                     email, 
                     provider: account.provider, 
                     name: !userWithThisNameExists ? name : convertedName(name), 
                     picture 
                  })
                  await newUser.save();
               } catch (err) {
                  console.log(err.message)
               }
            } else {    
               return user;
            }   
         }
         return true
      },
      async session({ session }) {
         if (!session) return;

         // connecting to DB:
         await connectDB()
         const userData = await User.findOne({ email: session.user.email })
         
         const { password, ...other} = userData._doc
      
         return {
            user: other
         }
      },
   }
});