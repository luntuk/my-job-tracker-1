import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';
import { DEMO_USER } from '../utils/constants.js';

export const register = async (req, res) => {
  try {
    const isFirstAccount = (await User.countDocuments()) === 0;
    req.body.role = isFirstAccount ? 'admin' : 'user';

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    const token = createJWT({ userId: user._id, role: user.role });
    res.status(StatusCodes.CREATED).json({ msg: 'user created', token, user });
  } catch (error) {
    console.error('Register error:', error);
    throw new Error('Registration failed. Please try again or use demo account.');
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new UnauthenticatedError('Please provide email and password');
  }

  // Demo mode fallback
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    const token = createJWT({ userId: DEMO_USER._id, role: DEMO_USER.role });
    res.status(StatusCodes.OK).json({ 
      msg: 'Demo user logged in', 
      token, 
      user: DEMO_USER 
    });
    return;
  }

  try {
    // Verify database and JWT secret are configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      throw new Error('Server configuration error');
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      console.warn(`Login attempt: user not found for email ${email}`);
      throw new UnauthenticatedError('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      console.warn(`Login attempt: invalid password for email ${email}`);
      throw new UnauthenticatedError('Invalid credentials');
    }

    const token = createJWT({ userId: user._id, role: user.role });

    res.status(StatusCodes.OK).json({ msg: 'user logged in', token, user });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      throw error;
    }
    console.error('Login error:', error.message);
    throw new UnauthenticatedError('Invalid credentials or database connection error');
  }
};

export const logout = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
