import express from 'express';
import * as AUTH from '../controllers/home';
import * as PROFILE from '../controllers/profile';
import jwt from 'jsonwebtoken';
import upload from '../config/multer';

const ROUTER = express.Router();

const isLoggedIn = (req, res, next) => {
  if (!req.headers['authorization']) {
    res.status(403).send({ message: 'isNotAuthenticated' });
    return;
  }
  jwt.verify(
    req.headers['authorization'].split(' ')[1],
    process.env.SECRET,
    (error, user) => {
      if (error) {
        res.status(403).send({ message: 'isNotAuthenticated' });
        return;
      }
      next();
    }
  );
};

// * * * * * home * * * * *

// use Test API
ROUTER.use('/test', (req, res) => {
  res.status(200).send({ result: true });
});

// post Login User
ROUTER.post('/login', (req, res) => {
  AUTH.login(req, res);
});

// post New User
ROUTER.post('/register', (req, res) => {
  AUTH.register(req, res);
});

// post Logout User
ROUTER.post('/logout', (req, res) => {
  AUTH.logout(req, res);
});

// * * * * * profile * * * * *

// get Current User
ROUTER.get('/me', isLoggedIn, (req, res) => {
  PROFILE.me(req, res);
});

// update User
ROUTER.put('/user/:id', isLoggedIn, (req, res) => {
  PROFILE.updateUser(req, res);
});

// get Publication
ROUTER.get('/publication', isLoggedIn, (req, res) => {
  PROFILE.load(req, res);
});

// post Publication
ROUTER.post('/publication', isLoggedIn, upload.single('image'), (req, res) => {
  PROFILE.publish(req, res);
});

export default ROUTER;
