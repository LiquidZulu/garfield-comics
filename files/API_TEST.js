var discord_io = "// discord.io example\n// NOTE: I dont use discord.io so there may well be errors here, message me if you have issues\n\nvar Discord = require('discord.io');\n\nvar bot = new Discord.Client({\n\ttoken: TOKEN,\n\tautorun: true\n});\n\nbot.on('ready', function() {\n\tconsole.log('Logged in as %s - %s\\n', bot.username, bot.id);\n});\n\nbot.on('message', function(user, userID, channelID, message, event) {\n\tif (message === \"test\") APITESTER(user, userID, channelID, message, event)\n});\n\nfunction APITESTER(user, userID, channelID, message, event){\n\treadPage(`https://garfield-comics.glitch.me/~SRoMG/?date=\"${new Date()}\"`,   (result) => { // has to have '\"' on either side of date object, YYYY-MM-DD does not need this\n\t\tconst embed = JSON.parse(result.body);    // parses JSON response into object rather than JSON string\n\t\tbot.sendMessage({to: channelID, message: { embed }})    // posts the object as Discord embed object\n\t});\n}";
var pseudocode = `**//-- GENERIC PSEUDOCODE EXAMPLE --//**
========================================

INIT DISCORD API MODULE
LOGIN BOT

READ JSON PAGE ASYNCHRONOUSLY THEN PARSE AS OBJECT
SEND OBJECT TO DISCORD`

var Eris = `// Eris example
//  NOTE: I dont use Eris so there may well be errors here, message me if you have issues

async function readPage(link, _callback){
	const got = require('got');
	var result = await got(link);
	_callback(result);
}

function APITESTER(msg){
	readPage(\`https://garfield-comics.glitch.me/~SRoMG/?date="\${new Date()}"\`,   (result) => { // has to have '"' on either side of date object, YYYY-MM-DD does not need this
		const embed = JSON.parse(result.body);    // parses JSON response into object rather than JSON string
    bot.createMessage(msg.channel.id, { embed });    // posts the object as Discord embed object
	});
}

var bot = new Eris("BOT_TOKEN");
bot.on("ready", () => {
    console.log("Ready!");
});
bot.on("messageCreate", (msg) => {
    if(msg.content === "test") {
      APITESTER(msg)
    }
});
bot.connect();`

module.exports = {
  discord_js: '// Discord.js example\n// NOTE THE ASYNC STRUCTURE\n\nconst Discord = require(\'discord.js\');\nconst client = new Discord.Client();\nclient.login(TOKEN);\n\nasync function readPage(link, _callback){\n\tconst got = require(\'got\');\n\tvar result = await got(link);\n\t_callback(result);\n}\n\nfunction APITESTER(msg){\n\treadPage(`https://garfield-comics.glitch.me/~SRoMG/?date="${new Date()}"`,   (result) => { // has to have \'"\' on either side of date object, YYYY-MM-DD does not need this\n\t\tconst embed = JSON.parse(result.body);    // parses JSON response into object rather than JSON string\n\t\tmsg.channel.send({ embed })    // posts the object as Discord embed object\n\t});\n}\n\n\nclient.on("message", async message => {\n\n\tif(message.content == "test") APITESTER(message);\n\n});\n\n\n\n\n',
  discord_io: discord_io,
  eris: Eris,
  pseudocode: pseudocode
}