# My First Leader Board Portal For Unity Project

It can:

* Post user's score to the leader board database
* Allow user to get leader board in game
* Unity game project is devived fully into component which make it's easier on design new game

## Dependencies:

Something you need to install before using it:

* MySQL
* Unity
* Nodejs
* expressjs module
* mysqljs module

## Step to run

* Run MySQL database server
	Run it as a service (config in Installation Process) or run it manually (go to MySQL installation folder\MySQL Server 8.0\bin\mysqld.exe)
* Run leader board web service
	open cmd in MyServer folder -> node server.js
* Run game
	Run game in Unity Editor or build a win32 version and then run it.
	
## To do in future

* Currently, it's just a test project therefore, the server and client communicate through localhost. The server should be a remote host so that we can test the delay of the request.
* The request data is totally insecured. We need to encrypt them before sending.
* Because it's my first web service, the javascript code isn't organized very well.