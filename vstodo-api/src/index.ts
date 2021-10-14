import "reflect-metadata";
require('dotenv-safe').config();
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from 'passport';

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

    // const user = await User.create({name: 'mukesh'}).save();
    // console.log(user)

    const app = express();
    passport.serializeUser(function(user: any, done) {
        done(null, user.accessToken);
    });
    app.use(passport.initialize());

    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: "http://localhost:3002/auth/github/callback",
            },
            (_, __, profile, cb) => {
                console.log(profile)
                cb(null, {accessToken: '', refreshToken: ''})
            }
        )
    );

    app.get('/auth/github', passport.authenticate('github', {session: false}));

    app.get(
        '/auth/github/callback', 
        passport.authenticate('github', {session: false}),
        function(_req, res) {
            // Successful authentication, redirect home.
            res.send('you logged in correctly');
        }
    );

    // APIs
    app.get('/', (_req, res) => {
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