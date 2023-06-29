const mongoose = require('mongoose')
// connecting to auth database
const authDBConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/mydata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
authDBConnection
  .on('error', (error) => {
    console.error('Failed to connect to Auth Database', error);
  })
  .once('open', () => {
    console.log('Connected to Auth Database');
    const UserSchema = new mongoose.Schema({
      username: String,
      password: String,
      profilePicture: String,
    });
    const User = authDBConnection.model('User', UserSchema);
  });
// connecting to user-data database
const userDataDBConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/User-Data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
userDataDBConnection
  .on('error', (error) => {
    console.error('Failed to connect to User-Data Database', error);
  })
  .once('open', () => {
    console.log("Connected to User-Data Database");
    const UserDataSchema = new mongoose.Schema({
      username: String,
      contacts: [String], // Array of contacts usernames
      chats: [{
        contact: String, // Username of the contact
        messages: [{
          sender: String, // Username of the sender
          content: String, // Message content
          timestamp: { type: Date, default: Date.now }, // Time of the message
        }],
      }],
      friendRequests: [{
        sender: String, // user who sent the request
        timestamp: { type: Date, default: Date.now }, // Time of the request
      }],
    });
    const UserData = userDataDBConnection.model('UserData', UserDataSchema);
  });
