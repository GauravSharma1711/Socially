import express from 'express'

import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotiofication, deleteNotiofications, getNotiofications } from '../controllers/notification.controller.js';

const router = express.Router()

router.get('/',protectRoute,getNotiofications);
router.delete('/',protectRoute,deleteNotiofications);
router.delete('/:id',protectRoute,deleteNotiofication);


export default router