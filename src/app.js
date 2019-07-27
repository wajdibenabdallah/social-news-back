import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import api from './routes';

dotenv.config();
const APP = express();
const ROUTER = express.Router();
mongoose.connect('mongodb://localhost:27017/testapp');
var db = mongoose.connection;
db.on('error', function() {});
db.once('open', function() {});
APP.use(bodyParser.json());

require('./config/passport')(passport);

ROUTER.use('/api', api);
APP.use(ROUTER);

const PORT = process.env.PORT || 4100;

APP.listen(PORT, () => {});

export default APP;
