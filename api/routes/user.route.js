import { Router } from 'express';
import {
  deleteAccount,
  updateAccount,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/middlewares/verifyToken.js';

const router = Router();

router.post('/update/:id',verifyToken, updateAccount);
router.delete('/delete/:id',verifyToken, deleteAccount);

export default router;
