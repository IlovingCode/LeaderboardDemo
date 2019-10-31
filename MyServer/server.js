/* eslint-env node */
/* eslint no-console: ["off"] */

const express = require('express')
const app = express()

const fs = require('fs');
const database = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

app.get('/mygame/hello', (req, res) => {
    res.send('Hi');
});

app.get('/mygame/user/:id', (req, res) => {
    res.send(JSON.stringify(getUser(req.params.id)));
});

app.get('/mygame/user/:id/:score', (req, res) => {
    let score = req.params.score;
    let user = getUser(req.params.id);
    if (+user.score < +score) user.score = score;
    res.send(JSON.stringify(user));
});

let getUser = function (id) {
    if (!database[id]) {
        database[id] = { score: 0 };
    }

    return database[id];
}

setInterval(() => {
    fs.writeFileSync('./data.json', JSON.stringify(database));
}, 15000);

const port = 8080;
app.listen(port, '0.0.0.0', () => console.log(`app listening on port ${port}`))