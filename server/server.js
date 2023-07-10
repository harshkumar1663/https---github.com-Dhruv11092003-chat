const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const app = express();
const cors = require('cors');
const bcrypt = require("bcrypt");
app.use(express.json({ limit: '10mb' }));

// connecting to AUTH database
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
  });



app.use('/api/profile-pictures', express.static(path.join(__dirname, 'public', 'ProfilePictures')));
const location_to_save_DP = path.join(__dirname , 'public' , 'ProfilePictures')

// get profile picture
const getUserProfilePicture = async (username) => {
  try {
    const userData = await UserData.findOne({ username });
    if (userData) {
      return userData.profilePicture;
    }
  } catch (error) {
    console.error('Failed to retrieve user profile picture:', error);
  }
  return null; // Return null if user profile picture is not found or an error occurs
};

app.get('/api/profile-pictures/:filename', async (req, res) => {
  const { filename } = req.params;

  if (filename.includes('-')) {
    // If full file name with extension is provided
    const filePath = path.join(__dirname, 'public', 'ProfilePictures', filename);
    res.sendFile(filePath);
  } else {
    // If only username is provided, retrieve the profile picture file name
    const profilePicture = await getUserProfilePicture(filename);
    if (profilePicture) {
      const filePath = path.join(__dirname, 'public', 'ProfilePictures', profilePicture);
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Profile picture not found' });
    }
  }
});

// schemas
// new user-auth schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  profilePicture: String,
});
const User = authDBConnection.model('User', UserSchema);

// new user-data schema
const UserDataSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  profilePicture: String,
  contacts: [String], // Array of contact usernames
  chats: [{
    contact: String, // Username of the contact
    messages: [{
      sender: String, // Username of the sender
      recipient: String, // Username of the recipient
      content: String, // Message content
      timestamp: { type: Date, default: Date.now }, // Time of the message
    }],
  }],
  friendRequests: [{
    sender: String, // User who sent the request
    timestamp: { type: Date, default: Date.now }, // Time of the request
  }],
});

const UserData = userDataDBConnection.model('UserData', UserDataSchema);

// const UserSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   profilePicture: String,
// });

// const User = mongoose.model('User', UserSchema);

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001']
};

app.use(cors(corsOptions));

// user signup
app.post("/api/signup", (req, res) => {
  const { username, password, profilePicture } = req.body;
  const picturePath = saveProfilePicture(profilePicture, username);

  if (!picturePath) {
    return res.status(400).json({ error: "Invalid image format" });
  }

  // Encrypt the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user document in the authentication database
  const newUserAuth = new User({
    username,
    password: hashedPassword,
    profilePicture: picturePath,
  });

  // Save the user document in the authentication database
  newUserAuth
    .save()
    .then(() => {
      // Create a new user document in the user-data database
      const newUserUserData = new UserData({
        username,
        profilePicture : picturePath,
        contacts: [],
        chats: [],
        friendRequests: [],
      });

      // Save the user document in the user-data database
      newUserUserData
        .save()
        .then(() => {
          res.status(201).json({ message: "Data saved successfully" });
        })
        .catch((error) => {
          console.error(
            "Failed to save user data in User-Data database",
            error
          );
          res.status(500).json({ error: "Failed to save data" });
        });
    })
    .catch((error) => {
      console.error("Failed to save user data in Auth database", error);
      res.status(500).json({ error: "Failed to save data" });
    });
});
function saveProfilePicture(base64Data, username) {
  const base64Image = base64Data.split(';base64,').pop();
  let picturePath = path.join( `${username.trim()}-DP`);
  const imageBuffer = Buffer.from(base64Image, 'base64');
  try {
    const dimensions = sizeOf(imageBuffer);

    if (
      dimensions.type !== 'jpg' &&
      dimensions.type !== 'jpeg' &&
      dimensions.type !== 'png'
    ) {
      return null;
    }
    let picturePathtosave = location_to_save_DP + '/' + picturePath +  `.${dimensions.type}`;
    picturePath += `.${dimensions.type}`;
    fs.writeFileSync(picturePathtosave, imageBuffer);
  } catch (error) {
    console.error('Failed to save profile picture', error);
    return null;
  }
  return picturePath;
  // return `/api/profile-pictures/${username}-DP.${dimensions.type}`;

}


// user signin
app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
          res.status(200).json({ message: "Sign in successful" });
        } else {
          res.status(401).json({ error: "Invalid username or password" });
        }
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    })
    .catch((error) => {
      console.error("Failed to sign in", error);
      res.status(500).json({ error: "Failed to sign in" });
    });
});

// check username availability
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  User.exists({ username })
    .then((exists) => {
      res.json({ available: !exists });
    })
    .catch((error) => {
      console.error('Failed to check username availability', error);
      res.status(500).json({ error: 'Failed to check username availability' });
    });
});

// send friend request
app.post('/api/send-friend-request', (req, res) => {
  const sender = req.body.user
  const receiver = req.body.username
  // Find the receiver data
  UserData.findOne({ username: receiver })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ error: 'Receiver not found' });
      }
      // Checking if the sender and receiver are already friends
      if (userData.contacts.includes(sender)) {
        return res.status(400).json({ message: 'Already friends' });
      }
      // Checking if a friend request has already been sent by the sender
      if (userData.friendRequests.some((request) => request.sender === sender)) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }
      // Add the friend request
      userData.friendRequests.push({ sender, timestamp: Date.now() });
      // Save the updated user data
      userData
        .save()
        .then(() => {
          res.status(200).json({ message: 'Friend request sent successfully' });
        })
        .catch((error) => {
          console.error('Failed to send friend request', error);
          res.status(500).json({ error: 'Failed to send friend request' });
        });
    })
    .catch((error) => {
      console.error('Failed to find receiver user data', error);
      res.status(500).json({ error: 'Failed to send friend request' });
    });
});

// user search
app.get('/api/search-users-data/:searchText', (req, res) => {
  const { searchText } = req.params;
  const regex = new RegExp(`^${searchText}`, 'i');
  User.find({ username: regex }, '_id username profilePicture')
    .then((users) => {
      const usersWithData = users
        .filter((user) => user.profilePicture !== null)
        .map((user) => {
          const { _id , username, profilePicture } = user;
          return { _id , username, profilePicture };
        });
      res.json(usersWithData);
    })
    .catch((error) => {
      console.error('Failed to fetch search users data', error);
      res.status(500).json({ error: 'Failed to fetch search users data' });
    });
});

// Retrieve friend requests for a user
app.get('/api/friend-requests/:username', (req, res) => {
  const { username } = req.params;

  // Find the user data document
  UserData.findOne({ username })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Retrieve the sender data, including profile picture
      const senderPromises = userData.friendRequests.map((request) => {
        return UserData.findOne({ username: request.sender });
      });

      // Execute all sender data retrieval promises
      Promise.all(senderPromises)
        .then((senderData) => {
          // Construct an array of friend requests with sender username and profile picture URL
          const friendRequests = userData.friendRequests.map((request, index) => {
            const sender = senderData[index];
            return {
              sender: request.sender,
              profilePicture: sender.profilePicture
            };
          });
          // Return the friend requests with sender profile pictures
          res.status(200).json({ friendRequests });
        })
        .catch((error) => {
          console.error('Failed to retrieve sender user data', error);
          res.status(500).json({ error: 'Failed to retrieve friend requests' });
        });
    })
    .catch((error) => {
      console.error('Failed to retrieve user data', error);
      res.status(500).json({ error: 'Failed to retrieve friend requests' });
    });
});


// Accept friend request
app.post('/api/accept-friend-request', (req, res) => {
  const { sender, receiver } = req.body;

  // Find the receiver's user data document
  UserData.findOne({ username: receiver })
    .then((receiverData) => {
      if (!receiverData) {
        return res.status(404).json({ error: 'Receiver not found' });
      }

      // Check if the sender is already a friend
      if (receiverData.contacts.includes(sender)) {
        return res.status(400).json({ error: 'Already friends' });
      }

      // Remove the friend request from the receiver's user data document
      receiverData.friendRequests = receiverData.friendRequests.filter(
        (request) => request.sender !== sender
      );

      // Add the sender to the receiver's contacts
      receiverData.contacts.push(sender);

      // Save the updated receiver's user data document
      receiverData
        .save()
        .then(() => {
          // Find the sender's user data document
          UserData.findOne({ username: sender })
            .then((senderData) => {
              if (!senderData) {
                return res.status(404).json({ error: 'Sender not found' });
              }

              // Check if the receiver is already a friend
              if (senderData.contacts.includes(receiver)) {
                return res.status(400).json({ error: 'Already friends' });
              }

              // Add the receiver to the sender's contacts
              senderData.contacts.push(receiver);

              // Save the updated sender's user data document
              senderData
                .save()
                .then(() => {
                  res.status(200).json({ message: 'Friend request accepted successfully' });
                })
                .catch((error) => {
                  console.error('Failed to accept friend request', error);
                  res.status(500).json({ error: 'Failed to accept friend request' });
                });
            })
            .catch((error) => {
              console.error('Failed to find sender user data', error);
              res.status(500).json({ error: 'Failed to accept friend request' });
            });
        })
        .catch((error) => {
          console.error('Failed to accept friend request', error);
          res.status(500).json({ error: 'Failed to accept friend request' });
        });
    })
    .catch((error) => {
      console.error('Failed to find receiver user data', error);
      res.status(500).json({ error: 'Failed to accept friend request' });
    });
});


// Reject friend request
app.post('/api/reject-friend-request', (req, res) => {
  const { sender, receiver } = req.body;

  // Find the receiver's user data document
  UserData.findOne({ username: receiver })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ error: 'Receiver not found' });
      }

      // Remove the friend request from the receiver's user data document
      userData.friendRequests = userData.friendRequests.filter((request) => request.sender !== sender);

      // Save the updated user data document
      userData
        .save()
        .then(() => {
          res.status(200).json({ message: 'Friend request rejected successfully' });
        })
        .catch((error) => {
          console.error('Failed to reject friend request', error);
          res.status(500).json({ error: 'Failed to reject friend request' });
        });
    })
    .catch((error) => {
      console.error('Failed to find receiver user data', error);
      res.status(500).json({ error: 'Failed to reject friend request' });
    });
});

// get user's contacts
app.get('/api/contacts/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserData.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contacts = await Promise.all(user.contacts.map(async (contactUsername) => {
      const contact = await UserData.findOne({ username: contactUsername });
      if (!contact) {
        return null; // Handle missing contact
      }
      return {
        username: contactUsername,
        profilePicture: contact.profilePicture,
      };
    }));
    console.log(contacts)
    res.json({ contacts: contacts.filter((contact) => contact !== null) });
  } catch (error) {
    console.error('Failed to get user contacts', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get user's contacts
app.get('/api/contacts/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserData.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contacts = await Promise.all(user.contacts.map(async (contactUsername) => {
      const contact = await UserData.findOne({ username: contactUsername });
      if (!contact) {
        return null; // Handle missing contact
      }
      return {
        username: contactUsername,
        profilePicture: contact.profilePicture,
        messages: contact.chats.find((chat) => chat.contact === username)?.messages || [],
      };
    }));

    res.json({ contacts: contacts.filter((contact) => contact !== null) });
  } catch (error) {
    console.error('Failed to get user contacts', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send message
app.post('/api/send-message', (req, res) => {
  const { sender, recipient, content } = req.body;
  console.log("send msg API called")
  console.log('Sender:', sender);
  console.log('Recipient:', recipient);
  // Find the user data documents for the sender and recipient
  Promise.all([
    UserData.findOne({ username: sender }),
    UserData.findOne({ username: recipient }),
  ])
  .then(([senderData, recipientData]) => {
    // console.log('Sender Data:', senderData);
    // console.log('Recipient Data:', recipientData);
      if (!senderData || !recipientData) {
        return res.status(404).json({ error: 'Sender or recipient not found' });
      }

      // Update sender's chat
      let senderChat = senderData.chats.find((chat) => chat.contact === recipient);
      if (!senderChat) {
        senderChat = { contact: recipient, messages: [] };
        senderData.chats.push(senderChat);
      }
      senderChat.messages.push({
        sender: sender,
        recipient: recipient,
        content: content,
      });

      // Update recipient's chat
      let recipientChat = recipientData.chats.find((chat) => chat.contact === sender);
      if (!recipientChat) {
        recipientChat = { contact: sender, messages: [] };
        recipientData.chats.push(recipientChat);
      }
      recipientChat.messages.push({
        sender: sender,
        recipient: recipient,
        content: content,
      });

      // Save both user data documents
      Promise.all([senderData.save(), recipientData.save()])
        .then(() => {
          console.log("message saved successfuly")
          res.status(200).json({ message: 'Message sent successfully' });
        })
        .catch((error) => {
          console.error('Failed to save user data', error);
          res.status(500).json({ error: 'Failed to send message' });
        });
    })
    .catch((error) => {
      console.error('Failed to find user data', error);
      res.status(500).json({ error: 'Failed to send message' });
    });
});


// Retrieve chats 
app.get('/api/chats/:receipient', (req, res) => {
  const { receipient } = req.params;
  console.log("get msg api called" ,receipient)
  // Find the user data document for the recipient
  UserData.findOne({ username: receipient })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ error: 'Recipient not found' });
      }
      res.status(200).json({ chats: userData.chats });
    })
    .catch((error) => {
      console.error('Failed to find recipient user data', error);
      res.status(500).json({ error: 'Failed to retrieve chats' });
    });
});

// get chat data for chats (only those contacts whom the user has chats with)
app.get('/api/chat-data/:username', (req, res) => {
  console.log("Filter msg api called")
  const { username } = req.params;
  UserData.findOne({ username })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }
      const filteredChatData = userData.chats.filter((chat) => chat.messages.length > 0);
      res.status(200).json({ chatData: filteredChatData });
    })
    .catch((error) => {
      console.error('Failed to retrieve chat data', error);
      res.status(500).json({ error: 'Failed to retrieve chat data' });
    });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
