/**
 * @prettier
 */

import { Router, application } from "express";
import bodyParser from "body-parser";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
	res.render("login");
});

router.post("/", (req, res) => {
	console.log(req.body);
});

export default router;
