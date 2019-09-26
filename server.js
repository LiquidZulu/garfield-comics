//TODO animated emoji Glitch, RNN Garfield comic/garf generator, feedback through DMs, shitpost version for royland.
//Help received from tphecca & scrippe; a huge thank you to both of them.
//node --experimental-modules my-app.mjs



const fs            = require('fs');
var channels        = require('./channels.json');
const Discord       = require('discord.js');
const config        = require('./config.js');
const sromg_api     = require('./sromg-api');
const META          = new sromg_api.META();
const FLAGS         = sromg_api.FLAGS;
const { JSDOM }     = require('jsdom');
const client        = new Discord.Client();
const token         = process.env.TOKEN;
const turndown      = require('turndown');
const util          = require('util');
const LIMITS        = config.LIMITS;
 

// login
client.login(token);
var ts = new turndown({
  hr: '\n',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*'
})


// prototypes
  
Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}


/**
 * wrapper for got calls, supports promises and functions
 * 
 * @author LiquidZulu, freenode
 * @param  {String}link  - The URL to read
 * @param  {Function}_cb - optional callback
 */

function readPage(link, _cb) {
  const prom = got(link);
  if(_cb) prom.then(_cb) 
  else return prom;
}


function getMonthString(month){if(month<10){month = '0' + month;}; return month}
function getDayString(day){if(day<10){day = '0' + day;}; return day}

function genURL(time){
  try{
    var day = getDayString(time.getDate());
    var month = getMonthString(time.getMonth() + 1);
    var year = time.getFullYear();
    
    var SRoMG = Math.floor((time - 1242691200000)/(1000*60*60*24));
    while (SRoMG.toString().length < 4){
      SRoMG = '0' + SRoMG;
      console.log(SRoMG);
    }
  
    var url = {
      comic: ("https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/" + year + "/" + year + "-" + month + "-" + day + ".gif"),
      SRoMG: ("http://www.mezzacotta.net/garfield/?comic=" + SRoMG),
      SRoMG_IMG: ('http://www.mezzacotta.net/garfield/comics/' + SRoMG + '.png')
    };
  
    return url;
  }catch(e){console.log(e)}
}

function RandInt(low, high, seed){
	
	var n = seed;
	var k = (high-low)/Math.PI;
	var n = Math.acos(Math.cos(n))*k + low;
	var n = Math.round(n);
	
	return n;
}

function seed(){
  var d = new Date();
  return d.getTime();
}

function GenTime(){
	var time = Date();
	var time = time.substring(16,21)
	return time
}

function SendComic(message, guild){
  
  channels = require('./channels.json');
  var channel = null;
  
  for(var g of channels.holyTexts){
    console.log(g)
    if(guild === g[0]){
      channel = client.channels.get(g[1]);
    }
  }
  
  if(channel == null){
    return;
  }
  
  var desc = 'Be sure to check out the daily Garfield comic.\nI think this comic is really cool (:, and that is my review.';
  var d = new Date();
  var url = genURL(new Date(d.getTime() - 1000*60*60*4.5));
  var embed = EmbedComic(message,desc, url.comic, url.comic);
  channel.send(embed);
  
  if(guild === undefined){
    try{
      var day = getDayString(d.getDate());
      var month = getMonthString(d.getMonth() + 1);
      var year = d.getFullYear();
      const twitter = require('./twitter.js');
      const twit = twitter;
      twit.postImg(url.comic, `Be sure to check out the daily Garfield comic for ${year}-${month}-${day}`, `Garfield Comic for ${year}-${month}-${day}\nI think this comic is really cool (:, and that is my review.`);
    }catch(e){console.log(e)}
  }
}


async function CheckTime(comic){
  channels = require('./channels.json');
  if (GenTime() === comic.time){
    for(var g of channels.holyTexts){
      try{
        SendComic(undefined, g[0]);
      }
      catch(e){
        console.log(`Failed CheckTime at ${g}`)
      }
    } client.channels.get(channels.private).send('SENDING COMIC')
      SendComic();
  }
  if (GenTime() === comic.SRoMG_time){
    let latest_sromg = await got(`http://www.mezzacotta.net/garfield/`)
    const { document } = (new JSDOM(latest_sromg.body)).window;
    let sromg_embed = EmbedSRoMG({
      comic: new sromg_api.Comic(document)
    });

    for(var g of channels.SRoMG){
      try{
        client.channels.get(g[1]).send(sromg_embed)
      }
      catch(e){
        console.log(`Failed CheckTime at ${g}`)
      }
    } 
    
    client.channels.get(channels.private).send('SENDING SRoMG')
  }
}


setInterval(async function ComicTimer() {
  
  var today = new Date();
  if (today.isDstObserved()) { 
      const comic = {
        time: '04:31',
        SRoMG: '11:00',
        SRoMG_time: '11:00'
      } 
    CheckTime(comic);
  }else{
    const comic = {
        time: '05:31',
        SRoMG: '11:00',
        SRoMG_time: '11:00'
      } 
    CheckTime(comic);
  }
},60000)


function EmbedComic(message, desc, url, link, meta){
  
  if (url==link){
  const embed = new Discord.RichEmbed()
      .setTitle('Daily Garfield Comic')
      .setAuthor('Jim Davis')
      .setColor(0xFF9900)
      .setDescription(desc)
      .setTimestamp()
      .setImage(url)
      //.setThumbnail()
      .setFooter('Powered by glitch.com')
      .setURL(link);
    
    return embed;
  }else{
    const SRoMG_Links = {
      IMG: url,
      PAGE: link
    }
    
    const embed = new Discord.RichEmbed()
        .setTitle(meta.title)
        .setAuthor('By ' + meta.author.name)
        .setColor(0xFF9900)
        .setDescription(desc)
        .setTimestamp()
        .setImage(SRoMG_Links.IMG)
        //.setThumbnail()
        .setFooter('Made by LiquidZulu  //  Licenced under Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported Licence ')
        .setURL(SRoMG_Links.PAGE)
        .addField('Author URL:', meta.author.url)
    
    if(meta.strips !== null){
      embed.addField('Original Strip(s):', meta.strips)
    }if(meta.desc !== ""){
      embed.addField('Description:\n', meta.desc);
    }
    
    return embed;
  }
}


function limitStr(s, l){
  if(s.length > l){
    return s.substring(0,l-3) + '...'
  }
  else return s;
}
  
  
function EmbedSRoMG(ARGS){

  const comic = ARGS.comic

  const SRoMG_Links = {
    IMG: comic.image.src,
    PAGE: `http://www.mezzacotta.net/garfield/?comic=${comic.number}`
  }
  
  const embed = new Discord.RichEmbed()
    .setTitle      (limitStr((() => { if(typeof ARGS["Title"] === typeof ""){return ARGS["Title"]}else return `No. ${comic.number}: ${comic.name}`})(), LIMITS.RICH_EMBED.TITLE))
    .setAuthor     (limitStr((() => { if(typeof ARGS["Author"] === typeof ""){return ARGS["Author"]}else return `By ${comic.author.name}`})(), LIMITS.RICH_EMBED.AUTHOR))
    .setColor      (0xFF9900)
    .setDescription(limitStr((() => { if(typeof ARGS["Description"] === typeof ""){return ARGS["Description"]}else return `Be sure to check out the daily SRoMG comic`})(), LIMITS.RICH_EMBED.DESCRIPTION))
    .setTimestamp  ()
    .setImage      (SRoMG_Links.IMG)
    .setFooter     ('Made by LiquidZulu  //  Licenced under Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported Licence ')
    .setURL        (SRoMG_Links.PAGE)
    .addField      ('\nAuthor URL:', `http://www.mezzacotta.net/garfield/author.php?author=${comic.author.number}`)
    .addField      ('\nThe Author Writes:', limitStr(ts.turndown(comic.authorWrites), LIMITS.RICH_EMBED.FIELD.VALUE))
    .addField      ('\nTranscription:', limitStr(ts.turndown(comic.transcription), LIMITS.RICH_EMBED.FIELD.VALUE))
    .addField      ('\nOriginal Strip(s):', limitStr((() => {
      let strips = '';
      for(let strip of comic.originalStrips){
        strips += `[${strip.strip}](${strip.href}) `
      }
      if(strips == ''){
        return "No original stips found"
      }
      return strips
    })(), LIMITS.RICH_EMBED.FIELD.VALUE));
  
  return embed;
}


function dateFormatter(cmsg){
  
  var date = cmsg[1];
  var format = cmsg[2];
  
  var dmyACT = cmsg[1].split('-')
  
  try{var dmyFORM = cmsg[2].split('-'); var FORM = 'FORMAT'}catch(e){var FORM = 'NO_FORMAT'}
  
  if (cmsg.length == 2){var year = dmyACT[0]; var month = dmyACT[1]; var day = dmyACT[2]}
  
  if(FORM == 'FORMAT'){
  
    if(dmyFORM[0].substring(0,1).toUpperCase() == 'Y' && dmyFORM[1].substring(0,1).toUpperCase() == 'M' && dmyFORM[2].substring(0,1).toUpperCase() == 'D'){var year = dmyACT[0]; var month = dmyACT[1]; var day = dmyACT[2]}
    if(dmyFORM[0].substring(0,1).toUpperCase() == 'M' && dmyFORM[1].substring(0,1).toUpperCase() == 'D' && dmyFORM[2].substring(0,1).toUpperCase() == 'Y'){var year = dmyACT[2]; var month = dmyACT[0]; var day = dmyACT[1]}
    if(dmyFORM[0].substring(0,1).toUpperCase() == 'D' && dmyFORM[1].substring(0,1).toUpperCase() == 'Y' && dmyFORM[2].substring(0,1).toUpperCase() == 'M'){var year = dmyACT[1]; var month = dmyACT[2]; var day = dmyACT[0]}
  
    if(dmyFORM[0].substring(0,1).toUpperCase() == 'D' && dmyFORM[1].substring(0,1).toUpperCase() == 'M' && dmyFORM[2].substring(0,1).toUpperCase() == 'Y'){var year = dmyACT[2]; var month = dmyACT[1]; var day = dmyACT[0]}
    if(dmyFORM[0].substring(0,1).toUpperCase() == 'M' && dmyFORM[1].substring(0,1).toUpperCase() == 'Y' && dmyFORM[2].substring(0,1).toUpperCase() == 'D'){var year = dmyACT[0]; var month = dmyACT[2]; var day = dmyACT[1]}
    if(dmyFORM[0].substring(0,1).toUpperCase() == 'Y' && dmyFORM[1].substring(0,1).toUpperCase() == 'D' && dmyFORM[2].substring(0,1).toUpperCase() == 'M'){var year = dmyACT[1]; var month = dmyACT[0]; var day = dmyACT[2]}
  }
  console.log(year + '-' + getMonthString(month) + '-' + getDayString(day));
  return new Date(year + '-' + getMonthString(month) + '-' + getDayString(day));
}


function GetSRoMG_Number(date){
  return ((+ date) - 1242691200000)/86400000
}

// javascript:alert(((+ new Date('2017-02-14')) - 1226750400)/86400000)
/**

2828 = (date - n)/86400000
244339200000‬ = date - n
n = date - 244339200000‬

244339200000
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var guilds = {}
var activities;
var currentIndex = 0;
var me = null;
console.log('before ready')
client.on('ready', () => { 
  console.log('I am ready!');
  me = client.users.find('id', '293462954240638977')
  activities = {
    time: 15000
  };
  setInterval(() => {
    activities.arr = [
      `Running on ${client.guilds.array().length} servers.`, 
      `Serving ${client.users.array().length} users.`, 
      '$help, $$ for SRoMG', 
      'https://garfield-comics.glitch.me/', 
      'By LiquidZulu | http://liquidzulu.xyz', 
      `Online since ${client.readyAt}.`, 
      'with SRoMG API'
    ]
    client.user.setActivity(activities.arr[currentIndex]);
    if (currentIndex < activities.arr.length - 1) currentIndex ++; else currentIndex = 0;
  }, activities.time)
})


const HGrunt = {
  
  dailyComicNomenclature: 'latest',
  
  prefixes: ['!garfield ', '!gf ', '!gar '],
  test: {
    today: (message) => {
      //message.channel.send(message.content.substring(0, HGrunt.dailyComicNomenclature.length));
      for(var i=0; i < HGrunt.prefixes.length; i++){
        var index = HGrunt.prefixes[i];
        if(message.content.substring(0, index.length + HGrunt.dailyComicNomenclature.length).toLowerCase() == index + HGrunt.dailyComicNomenclature){return true}
      }return false;
    },
    prefix: (message) => {
      for(var i=0; i < HGrunt.prefixes.length; i++){
        var index = HGrunt.prefixes[i];
        if(message.content.substring(0, index.length) == index){return true}
      }return false;
    }
  }
}


/**
 * Listens for messages -----------------------------------------------------
 */

client.on('message', async message => {
  

  if (message.author.id == client.user.id) return;

  switch(message.channel.type){
      
    case 'text':{
      {
        try{

          if (message.content.toUpperCase() === 'SHOW COMIC' || message.content.toUpperCase() === config.prefix + 'SHOWCOMIC'|| message.content.toUpperCase() === config.SRoMG_prefix + 'SHOWCOMIC' || message.content.toUpperCase() === 'G.TODAY' || HGrunt.test.today(message)) {
      
            var date = new Date();
            var desc = 'The Daily Garfield Comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.\nI think this comic is really cool (:, and that is my review.';
            var comicEmbed = EmbedComic(message,desc,genURL(new Date(date.getTime() - 1000*60*60*4.5)).comic,genURL(new Date(date.getTime() - 1000*60*60*4.5)).comic); //      message, desc, url, link, author
            
            message.channel.send(comicEmbed);
      
            return;
          }else if (message.content.toUpperCase() === 'SHOW SROMG' || message.content.toUpperCase() === config.prefix + 'SHOWSROMG') {
            
            let latest_sromg = await readPage(`http://www.mezzacotta.net/garfield/`)
            const { document } = (new JSDOM(latest_sromg.body)).window;
            let sromg_embed = EmbedSRoMG({
              comic: new sromg_api.Comic(document)
            });
            message.channel.send(sromg_embed);
            
            return;
          }
        }catch (e){console.error(e)}
        
        if (message.content === 'SendComic' && message.author.id == '293462954240638977') {
          
          channels = require('./channels.json');
          for(var g of channels.holyTexts){
            try{
              SendComic(undefined, g[0]);
            }catch(e){
              console.log(`Filed SendComic at: ${g}`)
            }
          }
          return;
          
          
        }else if (message.content === 'SendSRoMG' && message.author.id == '293462954240638977') {
          
          channels = require('./channels.json');
          let latest_sromg = await got(`http://www.mezzacotta.net/garfield/`)
          const { document } = (new JSDOM(latest_sromg.body)).window;
          let sromg_embed = EmbedSRoMG({
            comic: new sromg_api.Comic(document)
          });

          for(var g of channels.SRoMG){
            try{
              client.channels.get(g[1]).send(sromg_embed)
            }catch(e){
              console.log(`Filed SendSRoMG at: ${g}`)
            }
          }
          return;
          
          
        }else if (message.content === 'SendAll' && message.author.id == '293462954240638977') {
          channels = require('./channels.json');
          for(var g of channels.holyTexts){
            try{
              SendComic(undefined, g[0]);
            }catch(e){
              console.log(`Filed SendComic at: ${g}`)
            }
          }

          let latest_sromg = await got(`http://www.mezzacotta.net/garfield/`)
          const { document } = (new JSDOM(latest_sromg.body)).window;
          let sromg_embed = EmbedSRoMG({
            comic: new sromg_api.Comic(document)
          });

          for(var g of channels.SRoMG){
            try{
              client.channels.get(g[1]).send(sromg_embed)
            }catch(e){
              console.log(`Filed SendSRoMG at: ${g}`)
            }
          }
          return;
          
          
        }else if(message.content.substring(0, 2).toLowerCase == 'g.' || HGrunt.test.prefix(message)){
          
          var d = dateFormatter([].push(message.content.substring(2).split(' ')));
          var desc = 'The Daily Garfield Comic for ' + d.getFullYear() + '-' + getMonthString(d.getMonth() + 1) + '-' + getDayString(d.getDate()) + ' brought to you by LiquidZulu.\nI think this comic is really cool (:, and that is my review.';
          if(desc !== "The Daily Garfield Comic for NaN-NaN-NaN brought to you by LiquidZulu.\nI think this comic is really cool (:, and that is my review."){
            var comicEmbed = EmbedComic(message,desc,genURL(new Date(d.getTime()/* - 1000*60*60*7*/)).comic,genURL(new Date(d.getTime())).comic);
            message.channel.send(comicEmbed)
          }
          else{
            message.channel.send("There has been an error in parsing the date `" + message.content.substring(2) + "`\nThe $ syntax is preferred for most operations, example: `$randcomic`");
          }
        }
        
        if(message.content.toUpperCase().substring(0,2) === 'G.' && message.content.toUpperCase().substring(2, 3) !== 'T'){
          message.content = `${message.content.toUpperCase().substring(0,2)} ${message.content.toUpperCase().substring(2)}`; // adds space for g.YYYY-MM-DD
        }
        var mcon = message.content.trim();
        var cmsg = mcon.split(' ');
        cmsg = cmsg.map(v => v.trim());
        
        switch(cmsg[0].toUpperCase()){
        
          case config.prefix + 'SOURCE': case config.prefix + 'API':{
            {
              message.channel.send('Source code and API info can be viewed here: https://garfield-comics.glitch.me');
            }
            break;
          }
            
          case config.prefix + 'SEARCH':
          case 'G.':{
            {
              try {

                var d = dateFormatter(cmsg);
                var desc = 'The Daily Garfield Comic for ' + d.getFullYear() + '-' + getMonthString(d.getMonth() + 1) + '-' + getDayString(d.getDate()) + ' brought to you by LiquidZulu.\nI think this comic is really cool (:, and that is my review.';
                if(desc !== "The Daily Garfield Comic for NaN-NaN-NaN brought to you by LiquidZulu.\nI think this comic is really cool (:, and that is my review."){
                  var comicEmbed = EmbedComic(message,desc,genURL(new Date(d.getTime()/* - 1000*60*60*7*/)).comic,genURL(new Date(d.getTime())).comic);
                  message.channel.send(comicEmbed)
                }
                else{
                  message.channel.send("There has been an error in parsing the date `" + message.content.substring(2) + "`\nThe $ syntax is preferred for most operations, example: `$randcomic`");
                }

              } 

              catch (e) {
                console.error(e);
                message.channel.send('Error: '+e);
              }
            }
            break;
          }


          case config.SRoMG_prefix + 'SEARCH':{
            {
              try {
                
                let comic;
                
                if(cmsg[1].length == 4){
                  comic = await META.getComic(cmsg[1])
                }
                else{
                  comic = await META.getComic(GetSRoMG_Number(dateFormatter(cmsg)))
                }
                message.channel.send(EmbedSRoMG({
                  comic: comic,
                  desc: `SRoMG Comic #${comic.number} brought to you by LiquidZulu.`
                }))
              } 

              catch (e) {
                console.error(e);
                message.channel.send('Error: '+e);
              }
            }
            break;
          } 


          case config.prefix + 'RANDCOMIC':
          case 'g.random':{
            {
              try {

                var d = new Date();

                var date = new Date(RandInt(267087600000, d.getTime() - 1000*60*60*4.5, seed()))
                var desc = 'The Daily Garfield Comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.\nI think this comic is really cool (:, and that is my review.';

                message.channel.send(EmbedComic(message,desc,genURL(date).comic,genURL(date).comic));
              } 

              catch (e) {
                console.error(e);
                message.channel.send('Error: '+e);
              }
            }
            break;
          }

          case config.SRoMG_prefix + 'RANDCOMIC':{
            {
              try {

                let rand_sromg = await got(`http://www.mezzacotta.net/garfield/?comic=0`)
                const { document } = (new JSDOM(rand_sromg.body)).window;
                let comic = new sromg_api.Comic(document);

                message.channel.send(EmbedSRoMG({
                  comic: comic,
                  desc: `SRoMG Comic #${comic.number} brought to you by LiquidZulu.`
                }))

              } 

              catch (e) {
                console.error(e);
                message.channel.send('Error: '+e);
              }
            }
            break;
          }

          case config.prefix + 'HELP':{
            {
              try {
                message.channel.send(require('./helptext.js'));
              }

              catch (e) {
                console.error(e);
                message.channel.send('Error: '+e);
              }
            }
            break;
          }

          case `${config.prefix}INIT`:
          case `${config.SRoMG_prefix}INIT`:
            
            if( (message.author.id === message.guild.ownerID || message.author === me) && cmsg.length > 1){
              channels = require('./channels.json');

              switch(cmsg[1].toUpperCase()){
                case 'GARF':
                  var newGs = [];
                  for(var g of channels.holyTexts){
                    if(g[0] !== message.guild.id){
                      newGs.push(g)
                    }
                  }
                  newGs.push(
                    [message.guild.id, message.channel.id]
                  )
                  channels.holyTexts = newGs;
                break;

                case 'SROMG':
                  var newGs = [];
                  for(var g of channels.SRoMG){
                    if(g[0] !== message.guild.id){
                      newGs.push(g)
                    }
                  }
                  newGs.push(
                    [message.guild.id, message.channel.id]
                  )
                  channels.SRoMG = newGs;
                break;
              }
                
              fs.writeFile("./channels.json", JSON.stringify(channels), (e) => {
                if(e) {
                  message.channel.send(`An error has occurred in trying to save your preferences, please report the following error here: https://garfield-comics.glitch.me/feedback
    \`\`\`json
    ${e}\`\`\``);
                  return console.log(e);
                }
                
                var comicNames = ['GARF', 'SROMG'];
                if( comicNames.includes(cmsg[1].toUpperCase()) ){message.channel.send('Preferences saved')}
                else{message.channel.send('That is an invalid comic to init, valid comics are: ' + comicNames)}
                console.log("The file was saved!");
              });
            }else{
              message.channel.send('Only the server owner can use this command');
            }
            
          break;
            
          case `${config.prefix}CHANNELS`:
            if(message.author.id === message.guild.ownerID){
              message.channel.send(JSON.stringify(require('./channels.json')));
            }
          break;
        }  
      }
      break;
    }
      
    case 'dm':
      
      console.log('DM RECEIVED');
      
      try{
          
        // Send DM's to me
        
        if(message.author !== me && message.author !== client.user){
          
          var now = new Date();
          // Do your operations
          var difference = (now - message.author.createdAt)/1000/60/60/24;
          
          if(message.author.presence.game.party){
            var party = message.author.presence.game.party
          }else{var party = {size: undefined, id: undefined}}
          
          if(!message.author.presence.game.timestamps){message.author.presence.game.timestamps = {start: undefined, end: undefined}}
          
          const msg = new Discord.RichEmbed()
           .setTitle("<@" + message.author.id + ">")
           .setAuthor(`${message.author.username}#${message.author.discriminator}`)
           .setColor(0xED1313)
           //.setDescription('from ' + message.author.username)
           .setTimestamp()
           //.setImage()
           .setThumbnail(message.author.displayAvatarURL)
           .setFooter()
           .setURL()
           .addField('MESSAGE:\n', message.content)
           .addField('BOT:\n', message.author.bot)
           .addField('AGE:\n', Math.round(difference) + ' days (' + message.author.createdAt + ')')
           .addField('PRESENCE:\n', `Status: ${message.author.presence.status}
            Title: ${message.author.presence.game.name}
            Details: ${message.author.presence.game.details}
            Type: ${message.author.presence.game.type}
            State: ${message.author.presence.game.state}
            Start: ${message.author.presence.game.timestamps.start}
            End: ${message.author.presence.game.timestamps.end}
            ID: ${message.author.presence.game.applicationID}
            Party ID: ${party.id}
            Party Size: ${party.size}`)
           .addField('STREAMING:\n', message.author.presence.game.streaming)
          ;
          
          foo.OpenDM(me, msg, foo.DM);
        }
        
        if(message.author === me){
          var mcon = message.content.trim();
          var cmsg = mcon.split(' ');
          cmsg = cmsg.map(v => v.trim());
          
          switch(cmsg[0].toUpperCase()){
            
            case config.prefix + 'SERVERS':
              message.channel.send(`https://garfield-comics.glitch.me/~MOD/servers${process.env.OWNER_AUTH_CODE}`);
            break;
              
            case config.prefix + 'DM':
              var msg = '';
              for(var i=2; i<cmsg.length;i++){
                msg+=cmsg[i] + ' '
              }
              foo.OpenDM(client.users.find('id', cmsg[1]), msg, foo.DM);
            break;
          }
        }
        
        
      }catch(e){console.log(e)}
      
    break;
  }
});







// APP


//       const express = require('express')
//       const bodyParser = require('body-parser')
//       
//       // Create a new instance of express
//       const app = express()
//       
//       // Tell express to use the body-parser middleware and to not parse extended bodies
//       app.use(bodyParser.urlencoded({ extended: false }))
//       
//       // Route that receives a POST request to /sms
//       app.post('/sms', function (req, res) {
//         const body = req.body.Body
//         res.set('Content-Type', 'text/plain')
//         res.send(`You sent: ${body} to Express`)
//       })
//       
//       // Tell our app to listen on port 3000
//       app.listen(3000, function (err) {
//         if (err) {
//           throw err
//         }
//       
//         console.log('Server started on port 3000')
//       })




const pages = {
  index: require('./files/index.js'),
  feedback: require('./files/feedback.js'),
  API: require('./files/API.js')
};

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const got = require('got');
const PORT = process.env.PORT;
const timeout = require('./files/connect-timeout.js'); //express v4
const timeoutLength = 12000;

app.use(timeout(timeoutLength, {}));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
  else {
    const HTTPerr = require('./files/error_response.js');
    res.status(408).send((new HTTPerr(408).setDesc(new HTTPerr(408).desc += `\n\nTHIS SERVER TIMES OUT AFTER ${timeoutLength}`)).errPage);
  }
}

app.use(bodyParser.urlencoded({ extended: false })); // use body parser middleware

const foo = require('./foo.js');

// Route that receives a POST request to "./~POST"
app.post('/~POST/', (req, res) => {
  
  const formData = req.body;
  console.log(formData);
  const form = new Discord.RichEmbed()
   .setAuthor(formData.author)
   .setColor(0x0cf40c)
   .setTimestamp()
   .setDescription(formData.message);
  
  foo.OpenDM(me, form, foo.DM)
  res.set('Content-Type', 'text/html');
  res.send(`Content received, thank you for the feedback.`);
});

app.get('/~SRoMG*', async (req, res) => {
  
  let valid = true;
  
  // foo.OpenDM(me, 'SRoMG JSON request', foo.DM)
  (async () => {
    
    let comic = await META.getComic((() => {
      
      let n = 0;
      if(!!req.query.comic){
          n = Number(req.query.comic)
      }
      else if(!!req.query.url){
        n = Number(req.query.url.split('=')[1])
      }
      else{
        if(!!req.query.date){
          n = GetSRoMG_Number(new Date(req.query.date))
        }
        else{
          valid = false
          return false
        }
      }
      return n
    })())

    if(!valid){
      res.send(`Error: invalid query parameters: <pre>${util.inspect(req.query)}</pre>`)
    }
    
    else{
      res.send({
        data: comic,
        embed: EmbedSRoMG({
          comic: comic
        })
      });
    }
  })()
  
});


app.get(`/~MOD/servers${process.env.OWNER_AUTH_CODE}`, (req, res) => {
  res.set('Content-Type', 'application/JSON');
  res.send(JSON.stringify(
    {
      data: client.guilds.array()
    }
  ));
});

app.get(`/~MOD/servers${process.env.OWNER_AUTH_CODE}:*`, (req, res) => {
  
  const util = require("util")
  
  var n = req.originalUrl.split(':')[1]
  var resp = {
    data: client.guilds.array()[n]
  }
  
  res.set('Content-Type', 'text/html');
  
  var ANSI = (
    util.inspect(
      resp, 
      {
        depth: 20, 
        showHidden: false, 
        colors: true, 
        compact: false
      }
    )
  );
  
  var codedANSI = ''
  
  var i=0;
  for(var line of ANSI.split('\n')){
    codedANSI += `<line><line-number>${i+1}</line-number><code>${line}</code></line>\n`
    i++;
  }
  
  var AU = require('ansi_up');
  var ansi_up = new AU.default;
  ansi_up.escape_for_html = false
  var html = `<style>
body {
  background-color: rgba(30, 30, 30, 1);
  color: rgba(204, 204, 204, 1);
}

code{
  display: inline-block;
  padding-left: 0.5em;
  font-family: Consolas, "Courier New", "Lucida Console", monospace, monospace;
}

line-number{
  width: 4em;
  display: inline-block;
  font-family: Consolas, "Courier New", "Lucida Console", monospace, monospace;
  text-align: right;
}

line{
  display: inline-block;
  width: 100%;
  height: 1.2em;
  padding: 0.1em;
}

pre{
  display: block;
  margin: 1em;
  font-family: Consolas, "Courier New", "Lucida Console", monospace, monospace;
}

pre line:nth-of-type(even){
  background-color: rgba(35, 35, 35, 0.8);
}
pre line:nth-of-type(odd){
  background-color: rgba(40, 40, 40, 0.8);
}
</style>
<pre class='code'>${ansi_up.ansi_to_html(codedANSI)}</pre>`;
  
  res.send(html)
});


app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  console.log('Listening on port ' + process.env.PORT)
})



app.use("/",  express.static(__dirname + '/public')); // allows GET of /public/ files


// init public directories
app.get('/', (req, res) => res.send(pages.index));
app.get('/feedback/', (req, res) => res.send(pages.feedback));
app.get('/API/', (req, res) => res.send(pages.API));
app.get('/~invite', (req, res) => res.location(config.invite))



/* --- WEB SERVER THAT REQUESTS ITSELF by tphecca, modified by LiquidZulu --- */

app.get('/app', (req, res) => res.send('Run'));
app.get('/errors', (req, res) => {
  try{
    const HTTPerr = require('./files/error_response.js');
    res.status(req.query.err).send(new HTTPerr(req.query.err).errPage);
  }catch(e){console.error(e)}
});
app.get('/*', (req, res) => {
  const HTTPerr = require('./files/error_response.js');
  res.status(404).send(new HTTPerr(404).errPage);
})



setInterval(async function() {
  try {
    var ween = await got(`http://${process.env.PROJECT_DOMAIN}.glitch.me/app/`);
  } catch (e) {
    console.log("couldn't get myself");
  }
}, 3 * 60 * 1000)