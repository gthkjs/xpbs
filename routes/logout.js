/**
 * @prettier
 */

import { Router } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import CryptoJS from "crypto-js";
import pg from "pg";
import bcrypt from "bcrypt";

const client = new pg.Client({
	host: "localhost",
	port: 5432,
	database: "postgres",
	user: "postgres",
	password: "5432",
});

await client.connect();

const router = Router();

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
				name: "Will this user be logged out?",
				text: "SELECT * FROM users WHERE hash = $1",
				values: [original_hash],
			};
			const response = await client.query(query);
			if (response.rows.length > 0) {
				var user_email = response.rows[0].email;
				res.cookie("Logout_Cookie", user_email, {
					httpOnly: true,
					maxAge: 1000 * 60 * 60 * 24,
					encode: (hash) => {
						return CryptoJS.AES.encrypt(hash, "Secret").toString();
					},
				});
				res.clearCookie("Login_Cookie");
				var user = user_email;
				res.render("logout", { user });
			} else {
			}
		} catch (err) {
			if (err) {
				console.log(err);
			}
		}
	} else {
	}
});

router.post("/", async (req, res) => {
	if (req.cookies.Logout_Cookie) {
		var logout_cookie = req.cookies.Logout_Cookie;
		var cypher = CryptoJS.AES.decrypt(logout_cookie, "Secret");
		var email = cypher.toString(CryptoJS.enc.Utf8);
		try {
			const query = {
				name: "Has this user logged out?",
				text: "SELECT * FROM users WHERE email = $1",
				values: [email],
			};
			const response = await client.query(query);
			if (response.rows.length > 0) {
				const query1 = {
					name: "Will the user log in?",
					text: "SELECT * FROM users WHERE email = $1",
					values: [email],
				};
				const response1 = await client.query(query1);
				const real_hash = response1.rows[0].hash;
				console.log(real_hash);
				console.log(req.body.password);
				bcrypt.compare(
					req.body.password,
					real_hash,
					function (err, result) {
						if (err) {
							console.log(err);
							res.redirect("/login");
						}
						if (result) {
							console.log(result);
							res.cookie("Login_Cookie", real_hash, {
								httpOnly: true,
								maxAge: 1000 * 60 * 60 * 24,
								encode: (hash) => {
									return CryptoJS.AES.encrypt(
										hash,
										"Secret"
									).toString();
								},
							});
							res.clearCookie("Logout_Cookie");
							res.redirect("/dashboard");
						} else {
							console.log(err);
							res.clearCookie("Logout_Cookie");
							res.redirect("/login");
						}
					}
				);
			} else {
			}
		} catch (err) {
			if (err) {
				console.log(err);
				res.clearCookie("Logout_Cookie");
				res.redirect("/login");
			}
		}
	} else {
	}
});

export default router;
