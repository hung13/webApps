# Midterm, MuseumRobot:
This Twitter bot pulls images and information from the American Museum of Natural History and posts on Twitter. The bot will go to a predetermined url of the AMNH, download the picture and title of the relevant exhibit. It will then upload the title, link, and picture of the exhibit to Twitter, like most museum bots. The AMNH digital archive is mostly incremental; the bot is very dependent on this fact. The bot still needs to gracefully handle incorrect URLs. Another shortcoming of the bot is that it is not fully automatic. The website scrapping, picture/info downloading, and tweet posting are fully functional and automatic. But the 'bot.js' file itself needs to run to initiate these functions; the bot has yet to automatically make daily posts. 

## Getting started

1. Download the files and unzip them
2. Update 'config.js' with your personal Twitter keys
3. Open your command prompt (Windows)/terminal (OS X/Linux) and check if NodeJS is installed, enter the following command:
```
node -v
```
4. If a version number is returned, navigate to the directory with the downloaded files. 
5. Enter the commands to install the necessary Node modules/libraries for the bot:
```
> npm i twit
> npm i puppeteer
> npm i image-downloader
```
6. If NodeJS and the modules are installed successfully, run the bot using:
```
> node bot.js
```