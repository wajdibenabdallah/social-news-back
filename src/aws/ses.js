import express, { Router } from 'express';
import aws from 'aws-sdk';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import environment from '../config/environment';

const ROUTER = express.Router();

aws.config.loadFromPath(__dirname + '/config.json');

const ses = new aws.SES();

ROUTER.get('/verify', (req, res) => {
  let token = req.query.token;
  let decodedUserData = jwt.verify(token, process.env.SECRET);
  User.findOneAndUpdate(
    {
      email: decodedUserData.email,
      _id: decodedUserData.id,
    },
    {
      emailValid: true,
    },
    (error, user) => {
      if (error) {
        res.status(500).send(error);
      }
      if (user) {
        res.status(200).send({ message: 'user updated successfully' });
      } else {
        res.status(422).send({ message: 'user not found' });
      }
    }
  );
});

ROUTER.post('/send', (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1];
    let currentUser = jwt.verify(token, process.env.SECRET);
    let emailToken = jwt.sign(
      { id: currentUser.id, email: currentUser.email },
      process.env.SECRET
    );
    ses.sendEmail(
      {
        Source: `wajdibabdallah@gmail.com`,
        Destination: {
          ToAddresses: [currentUser.email],
        },
        Message: {
          Subject: {
            Data: `DevPlatform - Email Validation`,
            Charset: `UTF-8`,
          },
          Body: {
            Text: {
              Data: `Your validation email link :
                ${
                  environment['app'][process.env.NODE_ENV.trim()]['url']
                }/aws/verify?token=${emailToken}
              `,
              Charset: `UTF-8`,
            },
          },
        },
      },
      (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.status(200).send(data);
        }
      }
    );
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default ROUTER;
