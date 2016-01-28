# 4bot
A telegram bot to serve random content from 4chan image boards.

## How to use

4bot serves random images from 4chan image boards. In the commands list you can find all the available commands. Every command corresponds to a 4chan board. By executing a command, the bot will post a random image from the correspondent board (try /mu ).
You can also interact with 4bot via inline queries: type the bot username in a chat and write a board's name (without the /, for example @botfourbot mu) to query that board for a list of possible contents to post. You can open the content before posting it by clicking on the thumbnail. You will post some content by clicking on the contente name.
Enjoy!

## Deploy on heroku

1. Create a new heroku app.
2. Select GitHub as deployment method and connect it to this or to your repository.
3. Create a new bot account with [BotFather](https://telegram.me/BotFather).
4. Go to your heroku app settings page and create TELEGRAM_USERNAME and TELEGRAM_TOKEN config vars with your bot's username and token.
5. Setup webhook manually from command line:
```
    curl -X GET https://api.telegram.org/bot*YOUR_TOKEN*/setWebhook?url=https://*APPNAME*.herokuapp.com/telegramBot
```
