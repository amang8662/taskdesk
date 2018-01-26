import express, { Router } from 'express';
import validator from 'express-validator';
// Import actions from controllers
import { registerUser }  from './controllers/register';
import { login }  from './controllers/login';

// Initialize the router
const router = Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(validator());

// routes
router.post('/register', registerUser);
router.post('/login', login);

export default router;