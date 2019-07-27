import express from 'express';
const ROUTER = express.Router();
import * as API from '../controllers/authentication';

ROUTER.use('/test', (req, res) => {
  res.send('/api/test');
});

ROUTER.post('/login', (req, res, next) => {
  API.login(req, res, next)
  // require('../controllers/authentication').login(req, res, next);
});

ROUTER.post('/register', (req, res) => {
  API.register(req, res, next);
  // require('../controllers/authentication').register(req, res);
});

export default ROUTER;
