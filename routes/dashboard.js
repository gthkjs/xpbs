/**
 * @prettier
 */

import { Router } from "express";
import bodyParser from "body-parser";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
	res.render("dashboard");
});

export default router;
