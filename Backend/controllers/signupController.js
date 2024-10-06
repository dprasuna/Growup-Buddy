// controllers/signupController.js
const User = require('../models/user');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
