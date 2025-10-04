// routes/users.js

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added this line
const User = require('../models/User.js');
const Company = require('../models/Company.js');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, companyName, currency } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    let savedCompany;

    // 3. Check if this is the first user/signup
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      // This is the first user, create the Company and make this user the Admin
      if (!companyName || !currency) {
        return res.status(400).json({ msg: 'Company name and currency are required for the first user.' });
      }
      const newCompany = new Company({
        name: companyName,
        defaultCurrency: currency
      });
      savedCompany = await newCompany.save();

      newUser = new User({
        email,
        password: hashedPassword,
        role: 'Admin', // First user is always Admin
        company: savedCompany._id
      });

    } else {
      // For a hackathon, we'll simplify: assume an existing admin will create other users later.
      return res.status(400).json({ msg: 'A company already exists. New users must be added by an Admin.' });
    }

    const savedUser = await newUser.save();
    res.status(201).json({ msg: 'Admin and Company created successfully!', userId: savedUser._id, companyId: savedCompany._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login (NEW CODE ADDED BELOW)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. If credentials are correct, create a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;