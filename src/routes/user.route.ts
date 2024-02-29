import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import decodeAuth from '../middlewares/decodeAuth';
import { validateData } from '../middlewares/validation';
import { userLoginSchema, userSchema } from '../schemas/schemas';

const router: Router = Router();

router.post('/register', validateData(userSchema), userController.create);
router.post('/login', validateData(userLoginSchema), userController.login);
router.get('/auth', decodeAuth, userController.check);

export default router;
