/**
 * @prettier
 */

import express from "express";

const [server, port] = [express(), 3000];

server.listen(port, () => {
	console.log(`http://localhost${port}`);
});
