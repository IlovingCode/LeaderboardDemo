/* eslint-env node */
/* eslint no-console: ["off"] */

const express = require('express')
const app = express()

app.use("/client", express.static('../MyGame/builds/Client'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/mygame/hello', (req, res) => {
  res.send('Hi');
});

const fs = require('fs');
const database = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const process = require('child_process');
const lobbyList = [];
let roomPort = 7770;

const createLobby = function() {
  const ls = process.spawn('../MyGame/builds/Server/Server.exe', ['-batchmode', '-nographics']);
  console.log(ls.pid);
  lobbyList.push(ls);
};

const findID = function(pid) {
  for (i = 0; i < lobbyList.length; i++) {
    if (lobbyList[i].pid == pid)
      return i;
  }
  return -1;
}

const killProcess = function(pid) {
  let id = findID(pid);
  if (id == -1) return false;

  lobbyList[id].kill();
  lobbyList.splice(id, 1);
  return true;
}

app.get('/mygame/user/:name', (req, res) => {
  //console.log(req.url);
  res.send(`${database[req.params.name]}`);
});

app.get('/mygame/port/:pid/:port', (req, res) => {
  console.log(req.url);
  if (lobbyList.length > 0
    && lobbyList[lobbyList.length - 1].pid == req.params.pid
    && roomPort == req.params.port) {
    roomPort++;
    if (roomPort > 7773)
      roomPort = 7770;

    createLobby();
  }
  res.send(`${roomPort}`);
});

app.get('/mygame/result/draw/:pid', (req, res) => {
  console.log(req.url);
  killProcess(req.params.pid);
  res.send(`${lobbyList.length}`);
});

app.get('/mygame/result/:pid/:winner/:loser', (req, res) => {
  console.log(req.url);
  if (killProcess(req.params.pid)) {
    if (database[req.params.winner] == undefined)
      database[req.params.winner] = 30;
    else
      database[req.params.winner] += 30;

    if (database[req.params.loser] == undefined || database[req.params.loser] < 25)
      database[req.params.loser] = 0;
    else
      database[req.params.loser] -= 25;

    fs.writeFileSync('./data.json', JSON.stringify(database));
  }

  res.send(`${lobbyList.length}`);
});

const port = 8080
const buildRequired = true;
const buildType = 'WebGL';

if (buildRequired) {
  process.exec('cd ..');
  process.exec('E:/Unity/Editor/Unity.exe -quit -batchmode -executeMethod AutoBuildScript.BuildServer',
    function(error, stdout, stderr) {
      if (error)
        return;
      console.log(`build Server done!!!`);
      process.exec(`E:/Unity/Editor/Unity.exe -quit -batchmode -executeMethod AutoBuildScript.BuildClient${buildType}`,
        function(error, stdout, stderr) {
          if (error)
            return;
          console.log(`build Client done!!!`);
          app.listen(port, '0.0.0.0', () => console.log(`app listening on port ${port}`))
          createLobby();
          if (buildType == 'WebGL')
            process.exec(`start http://localhost:${port}/client/index.html`);
        });
    });
} else {
  app.listen(port, '0.0.0.0', () => console.log(`app listening on port ${port}`))
  createLobby();
}