import express, { Router } from 'express';
// Import register action from movies controller
import register  from './controllers/register';
import validator from 'express-validator';

// Initialize the router
const router = Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(validator());

// Handle /movies.json route with register action from movies controller
router.post('/register', register.registerUser);

export default router;