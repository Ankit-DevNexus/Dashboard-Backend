import express from 'express'
import { DashboardController } from '../controllers/DashboardController.js';
import { deleteUser, login, signup, updateUser } from '../controllers/authUserContoller.js';
import { createLead, getAllLeads, getLeadsFromMetaAPI, uploadLeadsFromExcel } from '../controllers/LeadController.js';
import upload from '../middleware/multerMiddleware.js';
import { Authenticate, authorize } from '../middleware/authMiddleware.js';
import { getUserLoginHistory } from '../controllers/UserLoginHistoryController.js';

const router = express.Router();

router.get('/', DashboardController);


// Apply middleware **before** admin routes
// router.use('/auth', authSessionMiddleware);


// sign up and login routes
router.post('/auth/api/signup-super-admin', signup);
router.get('/auth/api/signin-super-admin', login);

router.put('/auth/api/update-user/:id', Authenticate, authorize('admin'), updateUser);
router.delete('/auth/api/delete-user/:id', Authenticate, authorize('admin'), deleteUser);


// create and get Leads
router.post('/auth/api/Add-leads', Authenticate, createLead);
router.get('/auth/api/get-all-leads', getAllLeads);
router.post("/auth/api/upload-leads-excel", Authenticate, upload.single("file"), uploadLeadsFromExcel);

// get login history
router.get('/auth/api/user-login-history', Authenticate, authorize('admin'), getUserLoginHistory);


router.get('/auth/api/meta-ads/insights', Authenticate, getLeadsFromMetaAPI);

export default router;