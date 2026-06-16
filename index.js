import express from "express";

import client from "./database/db.js";
import auth from "./routes/auth.js";

const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));


app.use("/api/auth", auth);

function startServer(){

    try {
        console.log("Starting server...");
        client.connect();
        console.log("Database Connected!");
        console.log("Connected to the server...");
        app.listen(3000, (req, res) => {
            console.log("Server started on port 3000");
        })
    }catch(err){
        console.log("unable to connect to the server");
    }

}

startServer();
