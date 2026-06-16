import pg from "pg";


const client = new pg.Client({

    user: "postgres",
    host: "localhost",
    database: "learning",
    password: "Saipraneeth@2006",
    port: 5432,

})

export default client;