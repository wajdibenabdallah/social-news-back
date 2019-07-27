import express from 'express';
import * as API from '../controllers/authentication';
const ROUTER = express.Router();

ROUTER.use('/test', (_, res) => {
  res.send('success ...');
});

ROUTER.post('/login', (req, res, next) => {
  API.login(req, res, next);
});

ROUTER.post('/register', (req, res, next) => {
  API.register(req, res, next);
});

ROUTER.post('/logout', (req, res) => {
  API.logout(req, res);
});

export default ROUTER;
