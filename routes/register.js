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

router.post("/", async (req, res) => {
	// check if the email exists
	const query = {
		name: "Does this email exist?",
		text: "SELECT * FROM users WHERE email = $1",
		values: [req.body.email],
	};
	const response = await client.query(query);
	if (response.rows.length === 0) {
		// add the user if the email does not exist
		try {
			const query = {
				name: "Will this user be created?",
				text: "INSERT INTO users (email,hash) VALUES ($1,$2)",
				values: [req.body.email, req.body.password],
			};
			await client.query(query);
			res.redirect("/login");
		} catch (err) {
			console.log(err);
			res.redirect("/register");
		}
	} else {
		res.redirect("/register");
	}
});

export default router;
