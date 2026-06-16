import express from "express";


const adminMiddleware = (req, res, next) => {
    if(req.userInfo.role !== "admin") {
        return res.status(401).send({
            success: false,
            message: "You do not have permission to access this route"
        })
    }

    next();
}

export default adminMiddleware;