import express from "express";

const router = express.Router();

import authMiddleware from "../middleware/auth-middleware.js";

router.get("/", authMiddleware, async (req, res) => {

    const user = req.userInfo;
    res.status(200).json({
        message: "Welcome to the Home page",
        user: user,
    });
});

export default router;
