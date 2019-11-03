/* eslint-env node */
/* eslint no-console: ["off"] */

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

        leaderboard[id] = item;
    }

    return item;
}

let loadLeaderboard = function (db) {
    let res = [];
    let users = Object.keys(db);
    for (let i of users) {
        let score = +db[i].score;
        let item = res[score];
        if (!item) {
            item = { start: 0, data: [] };
            res[score] = item;
        }
        item.data.push(i);
    }

    let length = res.length;
    let start = 0;
    for (let i = length - 1; i > 0; i--) {
        let item = res[i];
        if (item) {
            item.start = start;
            start += item.data.length;
        }
    }

    return res;
}

let updateLeaderboard = function (id1, id2) {
    for (let i = id2; i < id1; i++) {
        let e = leaderboard[i];
        if (e) e.start++;
    }
}

let getRank = function (min, max) {
    let length = leaderboard.length;
    let res = [];
    while (--length > 0 && min <= max) {
        let item = leaderboard[length];
        if (!item) continue;
        let data = item.data;
        let start = item.start;
        let count = start + data.length - 1;
        if (count < min) continue;

        while (min <= count && min <= max) {
            let id = data[min - start];
            res.push({ id: id, score: getUser(id).score });
            min++;
        }
    }

    return res;
}

let getUser = function (id) {
    if (!database[id]) {
        database[id] = { score: 0 };
    }

    return database[id];
}

const express = require('express');
const app = express();

app.get('/mygame/hello', (req, res) => {
    res.send('Hi');
});

app.get('/mygame/user/:id', (req, res) => {
    let id = req.params.id;
    let user = getUser(id);
    let item = getLeaderboardItem(user.score);
    user.rank = item.start + item.data.indexOf(id) + 1;
    res.send(JSON.stringify(user));
});

app.get('/mygame/user/:id/:score', (req, res) => {
    let score = +req.params.score;
    let id = req.params.id;
    let user = getUser(id);

    let userScore = +user.score;
    if (userScore < score) {
        let item = getLeaderboardItem(userScore);
        item.data.splice(item.data.indexOf(id), 1);

        item = getLeaderboardItem(score);
        item.data.push(id);
        user.score = score;

        updateLeaderboard(score, userScore);

        user.rank = item.start + item.data.length;
    }

    res.send(JSON.stringify(user));
});

app.get('/mygame/rank/:min/:max', (req, res) => {
    let min = req.params.min;
    let max = req.params.max;
    if (min < 0) min = 0;
    if (max < 0) max = 0;
    if (max < min) {
        let t = min;
        min = max;
        max = t;
    }
    res.send(JSON.stringify(getRank(min, max)));
});

const fs = require('fs');
const database = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const leaderboard = loadLeaderboard(database);

setInterval(() => {
    fs.writeFileSync('./data.json', JSON.stringify(database));
}, 150000);

const port = 8080;
app.listen(port, '0.0.0.0', () => console.log(`app listening on port ${port}`))