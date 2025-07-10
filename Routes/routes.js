import express from 'express'
import { DashboardController } from '../controllers/DashboardController.js';
import { login, signup } from '../controllers/authUserContoller.js';
// import authSessionMiddleware from '../middleware/authSessionMiddleware.js';
import { createLead } from '../controllers/LeadController.js';
import Authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', DashboardController);


// Apply middleware **before** admin routes
// router.use('/auth', authSessionMiddleware);

router.post('/auth/api/signup-super-admin', signup);
router.get('/auth/api/signin-super-admin', login);


router.post('/auth/api/Add-leads', Authenticate, createLead);



export default router;