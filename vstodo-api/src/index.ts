import "reflect-metadata";
require('dotenv-safe').config();
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from 'passport';
import jwt from "jsonwebtoken";

// (async () => {
//     const app = express();
// })();


const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'vstodo',
        dropSchema: true,
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
            async (_, __, profile, cb) => {
                let user = await User.findOne({where: {githubId: profile.id}});
                if(user) {
                    user.name = profile.displayName
                    await user.save()
                } else {
                    user = await User.create({
                        name: profile.displayName, 
                        githubId: profile.id
                    }).save()
                }
                cb(null, {accessToken: jwt.sign(
                    {userId: user.id}, 
                    process.env.ACCESS_TOKEN_SECRET, 
                    {
                        expiresIn: "1yr",
                    }
                ),
            });
            }
        )
    );

    app.get('/auth/github', passport.authenticate('github', {session: false}));

    app.get(
        '/auth/github/callback', 
        passport.authenticate('github', {session: false}),
        function(req: any, res) {
            // Successful authentication, redirect home.
            res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`)
        }
    );

    // APIs

    app.get(
        '/me', 
        async (req: any, res) => {
            // Bearer afdgasdsag4a65da
            const authHeader = req.headers.authorization
            if(!authHeader) {
                res.send({user: null})
                return;
            }
            const token = authHeader.split(" ")[1];
            if(!token) {
                res.send({user: null})
                return;
            }
            
            let userId = '';
            try {
                const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                userId = payload.userId
            } catch(err) {
                res.send({ user: null})
                return
            }
            if(!userId) {
                res.send({ user: null})
                return;
            }
            const user = await User.findOne(userId);

            res.send({ user: user})

        }
    );

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