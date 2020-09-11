import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import api from './routes';
import config_passport from './config/passport';
import * as config_db from './config/db';
import session from 'express-session';
import cors from 'cors';

dotenv.config();
const APP = express();
APP.use(cors());
const ROUTER = express.Router();
let DATABASE;
let PORT;
if (process.env.NODE_ENV === 'dev') {
	DATABASE = config_db.dev.url;
	PORT = process.env.PORT || 4100;
} else {
	DATABASE = config_db.test.url;
	PORT = 5000 || 5100;
}
mongoose.connect(DATABASE, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

let db = mongoose.connection;
db.on('error', () => {});
db.once('open', () => {});
APP.use(bodyParser.json());
APP.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);
APP.use(passport.initialize());
APP.use(passport.session());
config_passport(passport);
ROUTER.use('/api', api);
APP.use(ROUTER);
APP.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
export default APP;
