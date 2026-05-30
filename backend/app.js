const express = require('express');
const cors = require('cors'); 
const app = express();


app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes); 

module.exports = app;