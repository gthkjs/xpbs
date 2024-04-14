/**
 * @prettier
 */

import express from "express";
import { default as login } from "./routes/login.js";
import { default as register } from "./routes/register.js";
import { default as logout } from "./routes/logout.js";

const [server, port] = [express(), 3000];

server.set("view engine", "ejs");

server.use("/login", login);
server.use("/register", register);
server.use("/logout", logout);

server.get("/", (req, res) => {
	res.render("root");
});

server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
