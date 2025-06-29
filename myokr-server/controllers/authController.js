import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registering user:', { name, email, role }); // 🪵

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ User registered:', newUser.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Attempting login for:', email); // 🪵

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('❌ User not found for email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 🔍 Log the stored and entered password
    console.log('🔐 Stored hashed password:', user.password);
    console.log('🔑 Entered plain password:', password);

    const isMatch = await bcrypt.compare(password, user.password);

    // 🔍 Log the result of comparison
    console.log('🔍 Password match:', isMatch);

    if (!isMatch) {
      console.warn('❌ Incorrect password for:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ Login successful:', email);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Fetch current user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
