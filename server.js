/**
 * @prettier
 */

import express from "express";

const [server, port] = [express(), 3000];

server.set("view engine", "ejs");

server.get("/", (req, res) => {
	res.render("root");
});

server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
