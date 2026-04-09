import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
import { TEST_USER_ID } from '../utils/constants.js';

export const authenticateUser = (req, res, next) => {
  // Check for token in Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('authentication invalid');
  }

  const token = authHeader.slice(7);

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === TEST_USER_ID;
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError('Demo User. Read Only!');
  next();
};
