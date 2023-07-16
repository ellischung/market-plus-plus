import express from 'express';
import { signin, signup, updateFavorite } from '../controllers/user.js'

//ROUTER FUNCTIONALITY NOT USED RIGHT NOW
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/update', updateFavorite);

export default router;
