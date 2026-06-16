import express from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied No token provided"
        })
    }

    try {

        const decodeToken = jwt.verify(token, "reddy");

        req.userInfo = decodeToken;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. token is not valid"
        })
    }
}

export default authMiddleware;

