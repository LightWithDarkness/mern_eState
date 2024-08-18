import express from 'express';
import { signIn, signUp,googleSignIn } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', googleSignIn);

export default router;
