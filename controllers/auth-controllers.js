import client from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const salt = await bcrypt.genSalt(10);


const register = async (req, res) => {

    const {username, email, password, role} = req.body;


    if (!username || !email || !password || !role) {
        return res.status(400).send({
            status: "error",
            message: "Username and password is required"
        });
    }


    try {

        const isUserExist = await client.query(`SELECT * FROM users WHERE email = $1 or username = $2`, [
            email, username
        ]);

        if (isUserExist.rows.length > 0) {
            return res.status(400).send({
                status: "error",
                message: "User already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, salt);

        const response = await client.query(`INSERT INTO users (userName, email, password, role) VALUES ($1, $2, $3, $4)`,
            [username, email, hashPassword, role? role : 'user']
        );

        return res.status(200).send({
            status: "success",
            message: "Successfully registered",
        });


    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message
        })
        console.log(` Register Error: ${err.message}`);
    }

}


const login = async (req, res) => {
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({
            status: "error",
            message: "Email and password is required"
        })
    }

    try {

        const result = await client.query(`SELECT * FROM users WHERE email = $1`,
            [ email ]);

        if (result.rows.length === 0) {
            return res.status(400).send({
                status: "error",
                message: "Email is not registered"
            })
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch) {
            return res.status(400).send({
                status: "error",
                message: "Invalid Password"
            })
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, "reddy", {expiresIn: "10m"});

        console.log(accessToken);

        return res.status(200).send({
            status: "success",
            message: "Successfully logged in",
            accessToken: accessToken
        })



    }catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message
        })
    }


}

const changePassword = async (req, res) => {

    const {password, newPassword} = req.body;

    if (!password || !newPassword) {
        return res.status(400).send({
            status: "error",
            message: "Email and password is required"
        })
    }

    try {

        const user = req.userInfo;

        const result = await client.query(`SELECT * FROM users WHERE email = $1`,
            [user.email]);

        if (result.rows.length === 0) {
            return res.status(400).send({
                status: "error",
                message: "Email is not registered"
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            result.rows[0].password
        );

        if (!isMatch) {
            return res.status(400).send({
                status: "error",
                message: "Invalid Password"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, salt);
        const response = await client.query(`UPDATE users SET password = $1 WHERE email = $2 AND id = $3`, [hashPassword, user.email, user.id]);


        return res.status(200).json({
            status: 200,
            message: "password updated sucessfully"
        })


    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message
        })
    }
}


export {register, login, changePassword};
