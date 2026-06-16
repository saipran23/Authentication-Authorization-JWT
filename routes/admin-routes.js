import express from "express";

const router = express.Router();

import authMiddleware from "../middleware/auth-middleware.js";
import adminMiddleware from "../middleware/admin-Middleware.js";

router.get("/", authMiddleware,adminMiddleware,   async (req, res) => {

    res.status(200).json({
        message: "Welcome to the admin page",
    });
});

export default router;
