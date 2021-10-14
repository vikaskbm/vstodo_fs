import express from "express";


// (async () => {
//     const app = express();
// })();


const main = async () => {
    const app = express();
    app.get('/', (_req, res) => {
        res.send("hello")
    })
    app.listen(3002, ()=> {
        console.log("Listening on 3002")
    })
};

main();