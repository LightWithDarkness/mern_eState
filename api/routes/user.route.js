import { Router } from 'express';
import {
  deleteAccount,
  updateAccount,
  getUserListing,
  getUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/middlewares/verifyToken.js';

const router = Router();

router.post('/update/:id',verifyToken, updateAccount);
router.delete('/delete/:id',verifyToken, deleteAccount);
router.get('/listings/:id',verifyToken, getUserListing);
router.get('/:id',verifyToken, getUser);

export default router;
