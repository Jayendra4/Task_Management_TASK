import express from 'express';
import { registrationController, loginController } from '../controller/user.controller.js'; 

const router = express.Router();

router.post("/registration", registrationController);
router.post("/login", loginController);

export default router;
