const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists with the given email
    const user = await User.findOne({ email });

    // If user doesn't exist or password doesn't match, return an error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a token with the user ID
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token in the response
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};
