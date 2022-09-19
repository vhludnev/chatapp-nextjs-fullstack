import mongoose from 'mongoose';

export const connectDB = async () => { 
   if (mongoose.connection.readyState >= 1) {
      return
   } 

   // mongoose.connection.on('connected', () => {
   //    console.log('connected to mongo db')
   // })
   // mongoose.connection.on('error', (err) => {
   //    console.log('db connection problem', err.message)
   // })
   // Use new db connection

   return mongoose.connect(process.env.MONGO_URL);
}

// export const disconnectDB = async () => { 
//    if (mongoose.connection.readyState >= 1) {
//       //console.log('connection closed')
//       return mongoose.connection.close()
//    } 
// }
