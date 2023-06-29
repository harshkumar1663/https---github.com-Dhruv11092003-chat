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
app.get('/api/profile-pictures/:filename', (req, res) => {
  let { filename } = req.params;
  const filePath = path.join(__dirname, 'public', 'ProfilePictures', filename);
  res.sendFile(filePath);
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
  username: String,
  profilePicture : String,
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

// const UserSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   profilePicture: String,
// });

// const User = mongoose.model('User', UserSchema);

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual URL of your frontend application
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





const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
