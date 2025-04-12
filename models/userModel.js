// models/userModel.js
const bcrypt = require('bcrypt');
const { getUserCollection } = require('../config/db');

async function registerUser(username, password) {
  try {
    const collection = getUserCollection();

    // Check if user already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(user);
    return { id: result.insertedId, username };
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    throw err;
  }
}

async function loginUser(username, password) {
  try {
    const collection = getUserCollection();

    // Find user
    const user = await collection.findOne({ username });
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }

    return { id: user._id, username };
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    throw err;
  }
}

module.exports = { registerUser, loginUser };