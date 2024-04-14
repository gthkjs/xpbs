/**
 * @prettier
 */

import { Router } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cookieParser from "cookie-parser";
import express from "express";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";

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
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser("Secret Key"));

router.get("/", async (req, res) => {
	if (req.cookies.Login_Cookie) {
		var login_key = req.cookies.Login_Cookie;
		var fake_hash = CryptoJS.AES.decrypt(login_key, "Secret");
		var original_hash = fake_hash.toString(CryptoJS.enc.Utf8);
		try {
			const query = {
				name: "Has this user been here before?",
				text: "SELECT * FROM users WHERE hash = $1",
				values: [original_hash],
			};
			const response = await client.query(query);
			if (response.rows.length > 0) {
				res.redirect("/dashboard");
			} else {
			}
		} catch (err) {
			if (err) {
				res.redirect("/login");
			}
		}
	} else {
	}
	res.render("login");
});

router.post("/", async (req, res) => {
	// check if the user has the correct credentials
	const query = {
		name: "Does this user exist?",
		text: "SELECT * FROM users WHERE email = $1",
		values: [req.body.email],
	};
	const response = await client.query(query);
	const real_hash = response.rows[0].hash;
	bcrypt.compare(req.body.password, real_hash, function (err, result) {
		if (err) {
			res.redirect("/login");
		}
		if (result) {
			res.cookie("Login_Cookie", real_hash, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24,
				encode: (hash) => {
					return CryptoJS.AES.encrypt(hash, "Secret").toString();
				},
			});
			res.redirect("/dashboard");
		} else {
			res.redirect("/login");
		}
		console.log(result);
	});
});

export default router;
