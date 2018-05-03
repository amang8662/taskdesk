import express, { Router } from 'express';
import validator from 'express-validator';
// Import actions from controllers
import RegisterController  from './controllers/RegisterController';
import LoginController from './controllers/LoginController';
import SkillController  from './controllers/SkillController';

// Initialize the router
const router = Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(validator());

// routes
router.post('/register', RegisterController.register);
router.post('/login', LoginController.login);
router.post('/skill/add', SkillController.add);

export default router;