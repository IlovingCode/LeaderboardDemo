/* eslint-env node */
/* eslint no-console: ["off"] */

var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

let count = 0;

// get count of users every session
/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "select count(*) from users";
  con.query(sql, function(err, result) {
    if (err) throw err;
    count = result[0]['count(*)'];
    console.log("Current Users: " + count);
  });
});*/

const express = require('express')
const app = express()

app.get('/mygame/hello', (req, res) => {
  res.send('Hi');
});

// Get user list sorted by score
app.get('/mygame/report', (req, res) => {
  var sql = "select * from users order by score desc";
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.send(result)
  });
})

// Update Score
app.get('/mygame/id/:userid/score/:score', (req, res) => {
  //Get playTime
  var sql = `select playTime from users where id = ${req.params.userid}`;
  let playtime = 0;
  con.query(sql, function(err, result) {
    if (err) throw err;
    playtime = result[0]['playTime'] + 1;
    // update score and playTime
    sql = `UPDATE users SET playTime = ${playtime}, score = ${req.params.score} WHERE id = ${req.params.userid}`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
    res.sendStatus(200);
  });
})

// register new user
app.get('/mygame/new/:name', (req, res) => {
  console.log(count);
  var sql = `INSERT INTO users (id, name, playTime, score) VALUES (${count}, '${req.params.name}', 0, 0)`;
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  res.send(`${count}`);
  count++;
})

const process = require('child_process')
const lobbyList = [];

app.get('/mygame/lobby/new', (req, res) => {
  const ls = process.spawn('../MyServerHost/build/ServerHost.exe', ['-batchmode']);
  lobbyList.push(ls);
  res.send(`${lobbyList.length}`);
});

app.get('/mygame/kill/:id', (req, res) => {
  if (req.params.id < 0 || req.params.id >= lobbyList.length){
    res.send('Invalid ID.');
    return;
  }
  lobbyList[req.params.id].kill();
  lobbyList.splice(req.params.id, 1);
  res.send(`${lobbyList.length}`);
});

const port = 8080
app.listen(port, () => console.log(`app listening on port ${port}`))
