import express from 'express';
import login, { logout } from '../controllers/auth.controller.js';

const routes = express.Router();

routes.post('/login', login);

routes.get('/logout', logout);

export default routes;
