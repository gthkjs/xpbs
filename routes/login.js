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
	res.render("login");
});

router.post("/", async (req, res) => {
	// check if the user has the correct credentials
	const query = {
		name: "Does this user exist?",
		text: "SELECT * FROM users WHERE email = $1 AND hash = $2",
		values: [req.body.email, req.body.password],
	};
	const response = await client.query(query);
	if (response.rows.length > 0) {
		res.redirect("/dashboard");
	} else {
		res.redirect("/login");
	}
});

export default router;
