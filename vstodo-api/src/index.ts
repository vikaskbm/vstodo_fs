import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";


// (async () => {
//     const app = express();
// })();


const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'vstodo',
        username: 'vstodo_user',
        password: 'Vikas@029',
        entities: [join(__dirname, './entities/*.*')],
        logging: !__prod__,
        synchronize: !__prod__
    })

    const user = await User.create({name: 'mukesh'}).save();
    console.log(user)
    const app = express();
    app.get('/aa', (_req, res) => {
        res.send({
            name: "hello",
            age: 22
        })
    })
    app.listen(3002, ()=> {
        console.log("Listening on 3002")
    })
};

main();