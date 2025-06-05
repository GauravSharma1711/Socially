import express from 'express'

import { protectRoute } from '../middleware/protectRoute.js';
import { followUnfollowUser, getProfile, suggestedUsers, updateProfile } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/profile/:username',protectRoute,getProfile);
router.get('/suggested',protectRoute,suggestedUsers);
router.post('/follow/:id',protectRoute,followUnfollowUser);
router.post('/update',protectRoute,updateProfile);

export default router