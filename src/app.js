import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import api from './routes';
import config_passport from './config/passport';
import { environment } from './config/environment';
import session from 'express-session';
import cors from 'cors';
import path from 'path';

dotenv.config();
const APP = express();
APP.use(express.static(path.join(__dirname, '..')));
APP.use(cors());
const ROUTER = express.Router();
console.log(process.env.NODE_ENV, typeof process.env.NODE_ENV);
if (!process.env.NODE_ENV) throw new Error('Unknown Environment');
const DATABASE = environment['db'][process.env.NODE_ENV.trim()]['url'];
const PORT = process.env.PORT;
mongoose.connect(DATABASE, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', () => {});
db.once('open', () => {});
APP.use(bodyParser.json({ limit: '50mb' }));
APP.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
APP.use(passport.initialize());
APP.use(passport.session());
config_passport(passport);
ROUTER.use('/api', api);
APP.use(ROUTER);
APP.listen(PORT, () => {
  console.info(`\nServer is running`);
  console.info(`\tPORT : ${PORT}`);
  console.info(`\tENVIRONMENT: ${process.env.NODE_ENV}\n`);
});
export default APP;
