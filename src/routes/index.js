import express from 'express';
import * as AUTH from '../controllers/authentication';
import * as PROFILE from '../controllers/profile';
import jwt from 'jsonwebtoken';

const ROUTER = express.Router();

const isLoggedIn = (req, res, next) => {
  let token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) {
      res.status(403).send({ message: 'isNotAuthenticated' });
      return;
    }
    next();
  });
};

// authentication

ROUTER.use('/test', (_, res) => {
  res.status(200).send({ result: true });
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

// profile

ROUTER.get('/me', isLoggedIn, (req, res) => {
  PROFILE.me(req, res);
});

ROUTER.get('/post', isLoggedIn, (req, res) => {
  PROFILE.load(req, res);
});

ROUTER.post('/post', isLoggedIn, (req, res) => {
  PROFILE.publish(req, res);
});

export default ROUTER;
