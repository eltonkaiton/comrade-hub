import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// REGISTER USER
// POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      accountType,
      agree
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    // Check passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.'
      });
    }

    // Check terms
    if (!agree) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the Terms and Privacy Policy.'
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Check phone
    const existingPhone = await User.findOne({
      phone: phone.trim()
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      accountType: accountType || 'Comrade',
      agree
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        accountType: user.accountType
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});


// ==========================================
// LOGIN USER
// POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
      remember
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Password incorrect
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Token duration
    const tokenDuration = remember ? '30d' : '7d';

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        accountType: user.accountType
      },
      process.env.JWT_SECRET,
      {
        expiresIn: tokenDuration
      }
    );

    // Login successful
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// ==========================================
// UPDATE CURRENT USER PROFILE
// PUT /api/auth/profile
// ==========================================
router.put('/profile', protect, async (req, res) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'accountType'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      const value = String(req.body[field] ?? '').trim();
      updates[field] = field === 'email' ? value.toLowerCase() : value;
    }
  });

  if (Object.values(updates).some((value) => !value)) {
    return res.status(400).json({
      success: false,
      message: 'Profile fields cannot be empty.'
    });
  }

  if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
    return res.status(400).json({
      success: false,
      message: 'Enter a valid email address.'
    });
  }

  try {
    Object.assign(req.user, updates);
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        accountType: req.user.accountType
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const label = field === 'email' ? 'email address' : 'phone number';
      return res.status(409).json({
        success: false,
        message: `That ${label} is already in use.`
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error('Profile update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

export default router;
