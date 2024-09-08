import { Router } from 'express';
import { verifyToken } from '../utils/middlewares/verifyToken.js';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  searchListings,
} from '../controllers/listing.controller.js';

const router = Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/search', searchListings);

export default router;
