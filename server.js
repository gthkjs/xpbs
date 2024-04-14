/**
 * @prettier
 */

import express from "express";
import { default as login } from "./routes/login.js";

const [server, port] = [express(), 3000];

server.set("view engine", "ejs");

server.use("/login", login);

server.get("/", (req, res) => {
	res.render("root");
});

server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
