import express from 'express';
import {
  signIn,
  signUp,
  googleSignIn,
  signOut,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout/:id',verifyToken, signOut);
router.post('/google', googleSignIn);

export default router;
