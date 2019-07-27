import express from 'express';
import * as API from '../controllers/authentication';
const ROUTER = express.Router();

ROUTER.use('/test', (req, res) => {
  res.send('/api/test');
});

ROUTER.post('/login', (req, res, next) => {
  API.login(req, res, next)
});

ROUTER.post('/register', (req, res, next) => {
  API.register(req, res, next);
});

export default ROUTER;
