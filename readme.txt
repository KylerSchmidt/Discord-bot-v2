This text file explains how to launch and configure the bot

node.js is needed to launch this bot. https://nodejs.org/

when node.js is installed, can be lauched from terminal/console:
node bot.js
or click on scripts runNoCMD.vbs, run.bat or run.sh

SETUP VIA CONFIG.JSON
an incomplete config.json will keep certain commands from functioning
or bot functioning at all:

desc            - general description of config.json.
botPrefix       - prefix to communicate with bot in server.
discordToken    - token to connect up to discord with server.
    This can be retreaved at https://discordapp.com/developers/applications/
    This is a good tutorial https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
googleapi       - https://console.developers.google.com free API can be retreaved here.
googleSearchID  - https://cse.google.com/cse/all ID can be created here. custom searches can be created.
weatherapi      - https://home.openweathermap.org/ can be created here. a free account will be needed.
weatherunits    - 
    imperial = Fahrenheit
    metric   = Celsius
