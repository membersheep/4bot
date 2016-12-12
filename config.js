var config = {};

config.SERVER_PORT = process.env.PORT || 3000;

config.BOT_NAME = process.env.TELEGRAM_USERNAME;
config.TOKEN = process.env.TELEGRAM_TOKEN;
config.START_MESSAGE = "Hi! this is 4bot, a telegram bot to serve random images from 4chan image boards. The bot is currently hosted on a freeware lightweight server, hence it's possible for you to experience poor performances in image and video posting. If you want better performances you can deploy your own copy of the bot in your super fast server, or you can modify it to optimize it! You can find the source code and a brief guide in the github repository:\nhttps://github.com/membersheep/4bot\nTo learn how to use the bot, execute the /help command.";
config.HELP_MESSAGE = "@botfourbot serves random images from 4chan image boards. In the commands list you can find all the available commands. Every command corresponds to a 4chan's board. By executing a command, the bot will post a random image from the correspondent board (try /mu ).\nYou can also interact with 4bot via inline queries: type the bot username in a chat and write a board's name (without the /, for example @botfourbot mu) to query that board for a list of possible contents to post. You can open the content before posting it by clicking on the thumbnail.\nEnjoy!";
config.TIME_LIMIT = 2;

config.TELEGRAM_BASE_URL = "https://api.telegram.org/bot";
config.TELEGRAM_SETUP_WEBHOOK = "/setWebhook?url=:url";
config.TELEGRAM_POST_MESSAGE = "/sendMessage";
config.TELEGRAM_POST_IMAGE = "/sendPhoto";
config.TELEGRAM_POST_VIDEO = "/sendVideo";
config.TELEGRAM_POST_DOCUMENT = "/sendDocument";
config.TELEGRAM_ANSWER_QUERY = "/answerInlineQuery";
config.TELEGRAM_CHAT_ACTION = '/sendChatAction';

config.CHAN_BASE_URL = "http://a.4cdn.org/";
config.CHAN_IMAGE_BASE_URL = "http://i.4cdn.org/";

config.BOTAN_TOKEN = process.env.BOTAN_TOKEN;

config.GENERIC_COMMANDS = ["/start", "/help"];
config.CHAN_SAFE_COMMANDS = ["/i", "/ic", "/r9k", "/s4s", "/cm", "/hm", "/lgbt", "/y", "/3", "/aco", "/adv", "/an", "/asp", "/biz", "/cgl", "/ck", "/co", "/diy", "/fa", "/fit", "/gd", "/hc", "/his", "/int", "/jp", "/lit", "/mu", "/n", "/news", "/out", "/po", "/pol", "/sci", "/soc", "/sp", "/tg", "/toy", "/trv", "/tv", "/vp", "/wsg", "/x"];
config.CHAN_UNSAFE_COMMANDS = ["/a", "/b", "/c", "/d", "/e", "/f", "/g", "/gif", "/h", "/hr", "/k", "/m", "/o", "/p", "/r", "/s", "/t", "/u", "/v", "/vg", "/vr", "/w", "/wg"];
config.COMMANDS = config.GENERIC_COMMANDS.concat(config.CHAN_SAFE_COMMANDS).concat(config.CHAN_UNSAFE_COMMANDS);
config.BOARD_COMMANDS = config.CHAN_SAFE_COMMANDS.concat(config.CHAN_UNSAFE_COMMANDS);

config.VALID_QUERIES = config.BOARD_COMMANDS.map(function(cmd) {return cmd.replace("/","");});
config.QUERY_RESULT_COUNT = 20;

module.exports = config;
