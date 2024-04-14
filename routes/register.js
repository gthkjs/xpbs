/**
 * @prettier
 */

import { Router } from "express";
import bodyParser from "body-parser";
import pg from "pg";

const router = Router();

const client = new pg.Client({
	host: "localhost",
	port: 5432,
	database: "postgres",
	user: "postgres",
	password: "5432",
});

await client.connect();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
	res.render("register");
});

router.post("/", (req, res) => {
	console.log(req.body);
});

export default router;
