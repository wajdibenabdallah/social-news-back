import express from 'express';
import * as AUTH from '../controllers/authentication';
import * as PROFILE from '../controllers/profile';

const ROUTER = express.Router();

ROUTER.use('/test', (_, res) => {
  res.send('success ...');
});

ROUTER.post('/login', (req, res, next) => {
  AUTH.login(req, res, next);
});

ROUTER.post('/register', (req, res, next) => {
  AUTH.register(req, res, next);
});

ROUTER.post('/logout', (req, res) => {
  AUTH.logout(req, res);
});

ROUTER.get('/me', (req, res) => {
  PROFILE.me(req, res);
});

export default ROUTER;
