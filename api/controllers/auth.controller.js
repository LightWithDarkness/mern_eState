import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { customError } from '../utils/custom.error.js';

const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    //checking if user already exist
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      next(customError(400, 'user already exist! with same username or email'));
    }

    //saving the new user
    const hashedPassword = bcryptjs.hashSync(password, 11);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: 'User Created Successfully' });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if user exist or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(customError(404, 'user not fount'));
    }
    //verify the password
    const validPassword = bcryptjs.compareSync(password, existingUser.password);
    if (!validPassword) {
      return next(customError(401, 'wrong credentials'));
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = existingUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true, maxAge: 3600000 })
      .status(200)
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

const googleSignIn = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email }).select('-password');
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res
        .cookie('access_token', token, { httpOnly: true, maxAge: 3600000 })
        .status(200)
        .json({ success: true, user: user._doc });
    } else {
      //save the user
      const username =
        name.split(' ').join('').toLowerCase() +
        Math.floor(Math.random() * 10000).toString();
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: photo,
      });
      await newUser.save();
      const { password:pass, ...user } = newUser._doc;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res
        .cookie('access_token', token, { httpOnly: true, maxAge: 3600000 })
        .status(200)
        .json({ success: true, user });
    }
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, googleSignIn };
