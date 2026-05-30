const { Router } = require('express');
const authRoutes = require('./auth.routes');
const personRoutes = require('./person.routes'); 

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/persons', personRoutes); 

module.exports = routes;