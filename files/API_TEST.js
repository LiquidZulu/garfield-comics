var discord_io = "// discord.io example\n// NOTE: I dont use discord.io so there may well be errors here, message me if you have issues\n\nvar Discord = require('discord.io');\n\nvar bot = new Discord.Client({\n\ttoken: TOKEN,\n\tautorun: true\n});\n\nbot.on('ready', function() {\n\tconsole.log('Logged in as %s - %s\\n', bot.username, bot.id);\n});\n\nbot.on('message', function(user, userID, channelID, message, event) {\n\tif (message === \"test\") APITESTER(user, userID, channelID, message, event)\n});\n\nfunction APITESTER(user, userID, channelID, message, event){\n\treadPage(`https://garfield-comics.glitch.me/~SRoMG/?date=\"${new Date()}\"`,   (result) => { // has to have '\"' on either side of date object, YYYY-MM-DD does not need this\n\t\tconst embed = JSON.parse(result.body);    // parses JSON response into object rather than JSON string\n\t\tbot.sendMessage({to: channelID, message: { embed }})    // posts the object as Discord embed object\n\t});\n}";
var pseudocode = `**//-- GENERIC PSEUDOCODE EXAMPLE --//**
========================================

INIT DISCORD API MODULE
LOGIN BOT

READ JSON PAGE ASYNCHRONOUSLY THEN PARSE AS OBJECT
SEND OBJECT TO DISCORD`

var Eris = `// Eris example
//  NOTE: I dont use Eris so there may well be errors here, message me if you have issues

function readPage(link, _cb) {
  const prom = got(link);
  if(_cb) prom.then(_cb) 
  else return prom;
}

function APITESTER(msg){
	readPage(\`https://garfield-comics.glitch.me/~SRoMG/?date="\${new Date()}"\`,   (result) => { // has to have '"' on either side of date object, YYYY-MM-DD does not need this
		const { embed } = JSON.parse(result.body);    // parses JSON response into object rather than JSON string
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
  discord_js: `// Discord.js example
// NOTE THE ASYNC STRUCTURE

const Discord = require(\'discord.js\');
const client = new Discord.Client();
client.login(TOKEN);

function readPage(link, _cb) {
  const prom = got(link);
  if(_cb) prom.then(_cb) 
  else return prom;
}

function APITESTER(msg){
  readPage(\`https://garfield-comics.glitch.me/~SRoMG/?date=\${new Date()}\`,   (result) => { 
    const { embed } = JSON.parse(result.body);    // parses JSON response into object rather than JSON string
    msg.channel.send({ embed })    // posts the object as Discord embed object
  });
}


client.on("message", async message => {

  if(message.content == "test") APITESTER(message);

});`,
  discord_io: discord_io,
  eris: Eris,
  pseudocode: pseudocode
}