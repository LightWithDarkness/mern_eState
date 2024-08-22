import { Router } from "express";
import { verifyToken } from "../utils/middlewares/verifyToken.js";
import {createListing} from "../controllers/listing.controller.js";

const router = Router()

router.post('/create',verifyToken,createListing)

export default router;