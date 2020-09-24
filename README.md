# Discord-bot-v2

bot for discord using discord.js with over 20 commands avaliable for the enduser

# Prerequisites

node.js is needed to launch this bot. https://nodejs.org/

# Installing

### SETUP VIA CONFIG.JSON

### an incomplete config.json will keep certain commands from functioning
### or bot functioning at all:

desc                      - general description of config.json.

botPrefix(required)       - prefix to communicate with bot in server.

discordToken(required)    - token to connect up to discord with server.

This can be retreaved at https://discordapp.com/developers/applications/
    
This is a good tutorial https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
    
googleapi       - https://console.developers.google.com free API can be retreaved here.

googleSearchID  - https://cse.google.com/cse/all ID can be created here. custom searches can be created.

weatherapi      - https://home.openweathermap.org/ can be created here. a free account will be needed.

weatherunits    - 
```
    imperial = Fahrenheit
    
    metric   = Celsius
```

# Running the Program
when all of the above is completed, can be lauched from terminal/console:
```
node bot.js
```

or click on scripts runNoCMD.vbs, run.bat or run.sh

the bot should output all commands as they are loaded in. Bot should join server.
