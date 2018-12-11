# Final Project, Multiplayer sidescrolling game:

## About:
A simple simple but still very incomplete game that aspires to be a multiplayer version Google's running T. rex. Currently, players can join the server to play. The jumping mechancis and collision knowledge are drafted but there are indeed a few problems. Firstly, when a player dies, the server needs to refresh before supporting another instance of the game. Basically, every player needs to complete the game, through winning or losing, before another game can be played. Second, currently, each sketch is generating its own obstacles to be broadcasted to all players on the server. This is inefficient since having more players would generate too many obstacles. Third, there is no point keeping system to track the winner. 

## Future directions:
As future improvements to complete the game, a game room is necessary to accommodate players joining/leaving the site at random times. This will also support multiple instances of the game so players can join another open game room once they have lost. Secondly, instead of generating obstacles client-side, the server will be adding these obstacles and broadcasting to the relevant game room. This would help client-server communications and game stability. Thirdly, or maybe this should be the first update, implement a point system, and potentially local leaderboard. Once all of these steps are accomplished, the project can be deployed to a third-party server.

## Getting started

1. Download the files and unzip them
2. Open your command prompt (Windows)/terminal (OS X/Linux) and check if NodeJS is installed, enter the following command:
```
node -v
```
3. If a version number is returned, navigate to the directory with the downloaded files. 
4. Install the necessary packages:
```
> npm install
```
5. Once NodeJS and the packages are installed properly, run the app by calling:
```
> node server.js
```
6. The port number will be displayed on the command prompt, navigate your web broswer to ```localhost:<port>``` to generate your player character - a white rectangle.

7. At this point in the development stage, pressing the <space> key will make your player jump. Colliding with the obstacles will result in losing the game.

9. To play again, restart the server and refresh the browser page. 

10. Patches in development...