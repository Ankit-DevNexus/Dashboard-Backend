import express from 'express'
import { DashboardController } from '../controllers/DashboardController.js';
import { login, signup } from '../controllers/authUserContoller.js';
import { createLead, getAllLeads, uploadLeadsFromExcel } from '../controllers/LeadController.js';
import upload from '../middleware/multerMiddleware.js';
import { Authenticate } from '../middleware/authMiddleware.js';
import { getUserLoginHistory } from '../controllers/UserLoginHistoryController.js';

const router = express.Router();

router.get('/', DashboardController);


// Apply middleware **before** admin routes
// router.use('/auth', authSessionMiddleware);

router.post('/auth/api/signup-super-admin', signup);
router.get('/auth/api/signin-super-admin', login);


router.post('/auth/api/Add-leads', Authenticate, createLead);

router.get('/auth/api/get-all-leads', getAllLeads);

router.post("/auth/api/upload-leads-excel", Authenticate, upload.single("file"), uploadLeadsFromExcel);


router.get('/auth/api/user-login-history', Authenticate,  getUserLoginHistory);


export default router;