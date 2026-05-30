const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth'); 

const routes = new Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);


routes.post('/activate', authMiddleware, AuthController.activateLicense);

module.exports = routes;