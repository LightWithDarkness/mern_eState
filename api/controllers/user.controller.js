import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { customError } from '../utils/custom.error.js';

const deleteAccount = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(
      customError(401, 'You can only delete your account not others')
    );
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie('access_token', { httpOnly: true })
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(
      customError(
        401,
        'you are not authorized, you can only update your own profile'
      )
    );
  try {
    const { username, email, password, avatar } = req.body;
    //checking if username or id is already acquired
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(customError(400, 'Username or email already in use'));
    }
    //if email, username exist
    if (password) {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      req.body.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          password: req.body.password,
          avatar,
        },
      },
      { new: true }
    ).select('-password');
    if (!updatedUser) {
      return next(customError(40, 'User not found'));
    }
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET);
    res
      .cookie('access_token', token, { httpOnly: true, maxAge: 3600000 })
      .status(200)
      .json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      });
  } catch (error) {
    next(error);
  }
};

export { deleteAccount, updateAccount };
