import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { User } from "./Schema/user.mjs";
import { hashPassword } from "./Hashpassword/Hash.mjs";
dotenv.config();

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.MONGO_URL;

const app = express();
app.use(express.json());

mongoose.connect(DATABASE_URL).then(() => {
  console.log("DB Connected");
  app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
  });
}).catch((e) => {
  console.log(e);
});

// Create a new user
app.post('/user', async (req, res) => {
  try {
    let { name, age, password } = req.body;
    password = await hashPassword(password); // Await the hashPassword function
    const data = { name, age, password };
    const newUser = new User(data);
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send({ error: 'Failed to create user' });
  }
});



// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a specific user by ID
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a user by ID
app.put('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a user by ID
app.delete('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});
 