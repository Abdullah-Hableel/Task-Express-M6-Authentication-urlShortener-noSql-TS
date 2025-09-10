import express from "express";
import { authorize } from "../../middlewares/Authenticat";

const router = express.Router();

import { shorten, redirect, deleteUrl } from "./urls.controllers";

router.post("/shorten/:userId", authorize, shorten);
router.get("/:code", redirect);
router.delete("/:code", authorize, deleteUrl);

export default router;
