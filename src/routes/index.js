import express from 'express';
const ROUTER = express.Router();

ROUTER.use('/test', (req, res) => {
  res.send('/api/test');
});

ROUTER.post('/login', (req, res, next) => {
  require('../controllers/authentication').login(req, res, next);
});

ROUTER.post('/register', (req, res) => {
  require('../controllers/authentication').register(req, res);
});

export default ROUTER;
