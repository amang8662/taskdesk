import express, { Router } from 'express';
import validator from 'express-validator';
// Import actions from controllers
import RegisterController  from './controllers/RegisterController';
import LoginController from './controllers/LoginController';
import TaskController  from './controllers/TaskController';
import SkillController  from './controllers/SkillController';
import UserController  from './controllers/UserController';

// Initialize the router
const router = Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(validator());

// routes
router.post('/register', RegisterController.register);
router.post('/login', LoginController.login);
router.get('/user/:userId', UserController.findbyid);
router.put('/user/:userId', UserController.update);
router.post('/user/update/avatar/:userId', UserController.updateavatar);

router.post('/task/add', TaskController.add);
router.get('/task/all/except/user/:userId', TaskController.findallexceptuser);
router.get('/task/user/:userId', TaskController.findbyuser);
router.get('/task/:taskId', TaskController.findbyid);
router.put('/task/:taskId', TaskController.update);
router.get('/task/aquired/user/:userId', TaskController.aquiredtasks);
router.post('/task/proposal/:taskId', TaskController.savetaskproposal);
router.get('/task/proposal/:taskId', TaskController.findproposalsbytask);
router.get('/proposal/:proposalId', TaskController.findproposalsbyid);
router.put('/task/proposal/:taskId', TaskController.selectproposal);

router.post('/skill/add', SkillController.add);
router.post('/skill/getbyname', SkillController.getByName);

export default router;