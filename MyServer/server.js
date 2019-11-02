/* eslint-env node */
/* eslint no-console: ["off"] */

const express = require('express')
const app = express()

const fs = require('fs');
const database = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const leaderboard = [];

app.get('/mygame/hello', (req, res) => {
    res.send('Hi');
});

app.get('/mygame/user/:id', (req, res) => {
    res.send(JSON.stringify(getUser(req.params.id)));
});

app.get('/mygame/user/:id/:score', (req, res) => {
    let score = +req.params.score;
    let id = req.params.id;
    let user = getUser(id);

    let userScore = +user.score;
    if (userScore < score) {
        let arr = getLeaderboardItem(userScore);
        arr.splice(arr.indexOf(id), 1);

        arr = getLeaderboardItem(score);
        arr.push(id);
        user.score = score;

        updateLeaderboard(score, userScore);
    }
    res.send(JSON.stringify(user));
});

let getLeaderboardItem = function (id) {
    let item = leaderboard[id];

    if (!item) {
        item = { start: 0, data: [] };
        let length = leaderboard.length;
        for (let i = id + 1; i < length; i++) {
            let e = leaderboard[i];
            if (e) {
                item.start = e.start + e.data.length;
                break;
            }
        }
    }

    return item;
}

let updateLeaderboard = function (id1, id2) {
    for (let i = id2; i < id1; i++) {
        let e = leaderboard[i];
        if (e) e.start++;
    }
}

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