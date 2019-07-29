import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import api from './routes';
import config_passport from './config/passport';
import * as config_db from './config/db';

dotenv.config();
const APP = express();
const ROUTER = express.Router();
let databaseName;
if (process.env.NODE_ENV === 'dev') databaseName = config_db.dev.url;
else databaseName = config_db.test.url;

mongoose.connect(databaseName, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

let db = mongoose.connection;
db.on('error', () => {});
db.once('open', () => {});
APP.use(bodyParser.json());
config_passport(passport);
ROUTER.use('/api', api);
APP.use(ROUTER);
const PORT = process.env.PORT || 4100;
APP.listen(PORT, () => {});
export default APP;
