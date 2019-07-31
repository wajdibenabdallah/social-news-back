import express from 'express';
import * as AUTH from '../controllers/authentication';
import * as PROFILE from '../controllers/profile';

const ROUTER = express.Router();

ROUTER.use('/test', (_, res) => {
  res.send('success ...');
});

ROUTER.post('/login', (req, res) => {
  AUTH.login(req, res);
});

ROUTER.post('/register', (req, res) => {
  AUTH.register(req, res);
});

ROUTER.post('/logout', (req, res) => {
  AUTH.logout(req, res);
});

ROUTER.get('/me', (req, res) => {
  PROFILE.me(req, res);
});

export default ROUTER;
