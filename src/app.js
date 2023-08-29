import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import api from "./routes";
import config_passport from "./config/passport";
import environment from "./config/environment";
import session from "express-session";
import cors from "cors";
import path from "path";
// import ses from "./aws/ses";

dotenv.config();
const APP = express();
APP.use(express.static(path.join(__dirname, "..")));
APP.use(cors());
const ROUTER = express.Router();
const DATABASE = environment["db"][process.env.NODE_ENV.trim()]["url"];
const PORT = process.env.PORT || 3000;

mongoose.connect(DATABASE, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);
mongoose.set("debug", true);
const db = mongoose.connection;
db.on("error", (error) => {
	console.error(error);
});
db.once("open", () => {
	console.info("Connection to Database : OK");
});

APP.use(bodyParser.json());
APP.use(bodyParser.raw());
APP.use(
	session({
		secret: process.env.SECRET || 'secret',
		resave: true,
		saveUninitialized: true,
	})
);
APP.use(passport.initialize());
APP.use(passport.session());
config_passport(passport);

ROUTER.use("/api", api);
// ROUTER.use("/aws", ses);

APP.use(ROUTER);
APP.listen(PORT, () => {
	console.info("\nServer is running");
	console.info(`\tPORT : ${PORT}`);
	console.info(`\tENVIRONMENT: ${process.env.NODE_ENV}\n`);
});
export default APP;
