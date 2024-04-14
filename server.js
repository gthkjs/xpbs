/**
 * @prettier
 */

import express from "express";
import { default as login } from "./routes/login.js";
import { default as register } from "./routes/register.js";
import { default as logout } from "./routes/logout.js";
import { default as dashboard } from "./routes/dashboard.js";

const [server, port] = [express(), 3000];

server.set("view engine", "ejs");

server.use("/login", login);
server.use("/register", register);
server.use("/logout", logout);
server.use("/dashboard", dashboard);

server.get("/", (req, res) => {
	res.render("root");
});

server.get("*", (req, res) => {
	res.redirect("/");
});

server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
