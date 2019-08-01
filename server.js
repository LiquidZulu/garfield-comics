//TODO animated emoji Glitch, RNN Garfield comic/garf generator, feedback through DMs, shitpost version for royland.
//Help received from tphecca & scrippe; a huge thank you to both of them.
//node --experimental-modules my-app.mjs



const fs = require('fs');
/*const channels = {
  private: '373438023511048192',
  holyTexts: '339155182875050004',
  SRoMG: '445210673777999882'
}*/

var channels = require('./channels.json');

// Import node modules
const Discord = require('discord.js');
const config = require('./config.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.TOKEN;
console.log('before login')
client.login(token);
console.log('after login')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMeta(page){// /garfield/author.php?author=
  
  for (var i=0; i<page.length; i++){
    if (page.substring(i,i+28) == '/garfield/author.php?author='){
      var url = "http://www.mezzacotta.net/garfield/author.php?author=";
      var x=i+29;
      do {
        var authID = page.substring(i+28,x)
        x++;
      }while (page.substring(x,x+1) != '>');
      x = x + 1;
      var y = x+1;
      do {
        var name = page.substring(x,y)
        y++;
      }while (page.substring(y,y+1) != '/');
      var author = {url: url + authID, name: name}
    }
  }
  
  for (var i=0; i<page.length; i++){
    
    if (page.substring(i, i+32) == '<p><b>The author writes:</b></p>'){//<p><b>The author writes:</b></p> = 32 chars
      
      var cont = false;
      var x = i+35;
      while (cont!==true){
        if (page.substring(x, x+4) == '</p>'){cont=true;}
        x++;
      }
      var desc = page.substring(i+36, x-1);
    }
  }
  
  
  var lines = page.split('\n')
  var title = lines[20].substring(4, lines[20].length - 5);
  
  for(var i=0; i<lines.length; i++){
    if(lines[i].substring(0, ('Original Strip').length).toUpperCase() === 'ORIGINAL STRIP'){var originalStripLine = i;}
  }
  
  if(originalStripLine){var strips = lines[originalStripLine].substring(('Original Strips:').length);} // 'Original Strips:' used as theres a space between Original Strip(s): and links so it will work for singular original and multiple originals.
  else{var strips = null}
  
  console.log(`STRIPS: ${strips}\n/\</g.test(strips): ${/\</g.test(strips)}\n!/\>/g.test(strips): ${!/\>/g.test(strips)}`);
  
  if(/\</g.test(strips) && !/\>/g.test(strips)){
    strips = '';
    var currentLine = originalStripLine;
    while(!/<\/p>/.test(lines[currentLine])){
      console.log(`testing: ${lines[currentLine]}`)
      currentLine++
    }
    
    for(var j=originalStripLine; j < currentLine + 1; j++){
      strips += lines[j]
    }
    strips.trim()
    strips = strips.substring(('Original Strips:').length, strips.length - ("</p>").length)
    console.log(`\n\n${strips}\n\n`)
  }
  
  const META = {
    desc: parseTags(desc),
    author: author,
    title: parseTags(title),
    strips: parseTags(strips)
  }
  return META;
}

function getMonthString(month){if(month<10){month = '0' + month;}; return month}
function getDayString(day){if(day<10){day = '0' + day;}; return day}

function genURL(time){
  try{
    console.log('genURL')
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
  
  var desc = 'Be sure to check out the daily Garfield comic.';
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
      twit.postImg(url.comic, `Be sure to check out the daily Garfield comic for ${year}-${month}-${day}`, `Garfield Comic for ${year}-${month}-${day}`);
    }catch(e){console.log(e)}
  }
}

function parseTags(str){
  
  if(typeof str !== typeof ""){
    return null
  }
  
  var newStr = '';
  var parsing = false;
  var reParse = false;
  
  for (var i=0; i<str.length; i++){
    
    var chr = str.substring(i, i+1);
    
    if(chr == '<'){
      
      var x = 0;
      while(true){
        x++;
        if(str.substring(i + x, i+1 + x) == '>'){break}
      }
      
      var tag = str.substring(i+1, i+x).trim().split(' ');// +1 on start and -1 on end to remove < & >
      i += x;
      if(tag[0].toLowerCase() == 'a'){
        var link = tag[1].substring(6, tag[1].length - 1); // removes `href="` & `"`
        var linkTextStart = i+1;
        parsing = true;
      }else if(tag[0].toLowerCase() == 'cite' && !parsing){newStr += '*'}else if(tag[0].toLowerCase() == '/cite' && !parsing){newStr += '*'}else if(tag[0].toLowerCase() == 'cite'){reParse = true}else if(tag[0].toLowerCase() == '/cite'){reParse = true}
      else if(tag[0].toLowerCase() == '/a'){
        var linkText = str.substring(linkTextStart, i-3);
        if(link.substring(0,1) === '"' || link.substring(0,1) === "'") link = link.substring(1)
        newStr += '[' + linkText + ']' + '(' + link + ')';
        parsing = false;
      }
    }else if(parsing){
    }else{newStr += chr}
  }
  
  if(reParse){newStr = parseTags(newStr);}
  
  return newStr;
}

function SendSRoMG(message, date, parseVar, guild){
  
  if(message == null){
    channels = require('./channels.json');
    var channel = null;

    for(var g of channels.SRoMG){
      if(guild === g[0]){
        channel = client.channels.get(g[1]);
      }
    }

    if(channel == null){
      return;
    }
  }
  
  try{
    if(!parseVar){var SRoMG_URL = genURL(new Date(date.getTime()/* - 1000*60*60*11*/));}
    else{var SRoMG_URL = {
      SRoMG: ("http://www.mezzacotta.net/garfield/?comic=" + date),
      SRoMG_IMG: ('http://www.mezzacotta.net/garfield/comics/' + date + '.png')
    }}
    var desc = 'Be sure to check out the daily SRoMG comic';
    var url = SRoMG_URL.SRoMG_IMG;
    var link = SRoMG_URL.SRoMG;
    
    readPage(link,   (result) => {
      try{
        var meta = getMeta(result.body)
        if(message == null){channel.send(
          EmbedComic(message, desc, url, link, meta)
        );}else{
          if(!parseVar){desc = 'The daily SRoMG comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.';}
          else{desc = 'SRoMG comic ' + date + ' brought to you by LiquidZulu'} // note improve this, you were lazy by not extracting date from SRoMG comic No., you already did the work in genURL()
          message.channel.send(
            EmbedComic(message, desc, url, link, meta)
          );}
    
        if(!message){
          if(guild === undefined){
            try{
              var d = new Date();
              var day = getDayString(d.getDate());
              var month = getMonthString(d.getMonth() + 1);
              var year = d.getFullYear();
              const twitter = require('./twitter.js');
              const twit = twitter;
              twit.postImg(url, `${desc} for ${year}-${month}-${day}\nMade by ${meta.author.name}, ${meta.author.url}\nLicenced under Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported Licence`, `Square Root of Minus Garfield Comic for ${year}-${month}-${day}`);
            }catch(e){console.log(e)}
          }
        }
      }catch(e){console.log(e)}
    });
  }catch(e){console.log(e)}
}

function CheckTime(comic){
  channels = require('./channels.json');
  //client.channels.get(channels.private).send('Time is ' + comic.time)
  //client.channels.get(channels.private).send('GenTime() = ' + GenTime() + '\ncomic = time:' + comic.time + ', SRoMG:' + comic.SRoMG)
  if (GenTime() === comic.time){
    for(var g of channels.holyTexts){
      SendComic(undefined, g[0]);
    } client.channels.get(channels.private).send('SENDING COMIC')
      SendComic();
  }
  if (GenTime() === comic.SRoMG_time){
    for(var g of channels.SRoMG){
      SendSRoMG(null, new Date(), undefined, g[0]); 
    } client.channels.get(channels.private).send('SENDING SRoMG')
      SendSRoMG(null, new Date()); 
  }
}

function resolveAfter1Hour(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 1000*60*60);
  });
}

setInterval(async function ComicTimer() {
  
  Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }
  
  Date.prototype.isDstObserved = function () {
      return this.getTimezoneOffset() < this.stdTimezoneOffset();
  }
  
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

function logMsg(message){
	console.log('\n//////////////////////////////////////\n');
	console.log('-----------RECEIVED MESSAGE-----------');
	console.log('CHANNEL ID: ' + message.channel.id);
  console.log('CHANNEL NAME: ' + message.channel.name);
	console.log('MESSAGE ID: ' + message.id);
	console.log('SENDER: ' + message.author);
	console.log('CONTENT: ' + message.content);
	console.log('CREATED AT: ' + message.createdAt);
	console.log('EMBEDS: ' + message.embeds);
	console.log('TYPE: ' + message.type);
	console.log('WEBHOOK ID (IF APPLICABLE): ' + message.webhookID);
	console.log('\n//////////////////////////////////////\n\n');
};

function EmbedComic(message, desc, url, link, meta){
  
  console.log('EmbedComic')
  
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
    console.log('SROMG EMBED COMIC')
    var date = new Date();
    //var SRoMG_URL = genURL(new Date(date.getTime() - 1000*60*60*7));
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

function regex(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var guilds = {}
var activities;
var currentIndex = 0;
var me = null;
console.log('before ready')
client.on('ready', () => { 
  console.log('I am ready!');
  me = client.users.find('id', '293462954240638977')
  activities = {time: 15000};
  setInterval(() => {
    activities.arr = [`Running on ${client.guilds.array().length} servers.`, `Serving ${client.users.array().length} users.`, '$help, $$ for SRoMG', 'https://garfield-comics.glitch.me/', 'By LiquidZulu | http://liquidzulu.xyz', `Online since ${client.readyAt}.`, 'with SRoMG API']
    client.user.setActivity(activities.arr[currentIndex]);
    if (currentIndex < activities.arr.length - 1) currentIndex ++; else currentIndex = 0;
  }, activities.time)
})
console.log('after ready')

async function readPage(link, _callback){
  const got = require('got');
  var result = await got(link);
  _callback(result);
}

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


// Create an event listener for messages
client.on('message', async message => {
  
  
  switch(message.channel.type){
      
    case 'text':
    
      if (message.author.id == client.user.id) return;
      //logMsg(message);
      
      try{
        if (message.content.toUpperCase() === 'SHOW COMIC' || message.content.toUpperCase() === config.prefix + 'SHOWCOMIC'|| message.content.toUpperCase() === config.SRoMG_prefix + 'SHOWCOMIC' || message.content.toUpperCase() === 'G.TODAY' || HGrunt.test.today(message)) {
    
          var date = new Date();
          var desc = 'The Daily Garfield Comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.';
          var comicEmbed = EmbedComic(message,desc,genURL(new Date(date.getTime() - 1000*60*60*4.5)).comic,genURL(new Date(date.getTime() - 1000*60*60*4.5)).comic); //      message, desc, url, link, author
          
          message.channel.send(comicEmbed);
    
          return;
        }else if (message.content.toUpperCase() === 'SHOW SROMG' || message.content.toUpperCase() === config.prefix + 'SHOWSROMG') {
          var date = new Date();
          var date = new Date(new Date(date.getTime() - 1000*60*60*11)); 
          var desc = 'The Daily SRoMG Comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.';
          var url = genURL(date).SRoMG_IMG;
          var link = genURL(date).SRoMG;
          console.log(`${url}  ${link}`)
    
          readPage(link,   (result) => {
            console.log('readPage at SHOW SROMG')
            var meta = getMeta(result.body)
            console.log(`${message} ${desc} ${url} ${link} ${meta}`)
            var comicEmbed = EmbedComic(message, desc, url, link, meta);
            console.log(`comicEmbed: ${comicEmbed}`)
            message.channel.send(comicEmbed);
          });
          return;
        }
      }catch (e){console.error(e)}
      
      if (message.content === 'SendComic' && message.author.id == '293462954240638977') {
        
        channels = require('./channels.json');
        for(var g of channels.holyTexts){
          SendComic(undefined, g[0]);
        }
        return;
        
        
      }else if (message.content === 'SendSRoMG' && message.author.id == '293462954240638977') {
        
        channels = require('./channels.json');
        for(var g of channels.SRoMG){
          SendSRoMG(null, new Date(), undefined, g[0]); 
        }
        return;
        
        
      }else if (message.content === 'SendAll' && message.author.id == '293462954240638977') {
        channels = require('./channels.json');
        for(var g of channels.holyTexts){
          SendComic(undefined, g[0]);
        }
        for(var g of channels.SRoMG){
          SendSRoMG(null, new Date(), undefined, g[0]); 
        }
        return;
        
        
      }else if(message.content.substring(0, 2).toLowerCase == 'g.' || HGrunt.test.prefix(message)){
        
        var date = message.content.substring(2);
        date = date.split('-');
        year = date[0];
        month = date[1];
        day = date[2];
        
        var d = new Date(year + '-' + getMonthString(month) + '-' + getDayString(day));
        var desc = 'The Daily Garfield Comic for ' + d.getFullYear() + '-' + getMonthString(d.getMonth() + 1) + '-' + getDayString(d.getDate()) + ' brought to you by LiquidZulu.';
        if(desc !== "The Daily Garfield Comic for NaN-NaN-NaN brought to you by LiquidZulu."){
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
	    
        case config.prefix + 'SOURCE': case config.prefix + 'API':
          message.channel.send('Source code and API info can be viewed here: https://garfield-comics.glitch.me');
        break;
          
        case config.prefix + 'SEARCH':
          case 'G.':

            try {

              var date = cmsg[1];
              var format = cmsg[2];

              var dmyACT = cmsg[1].split('-')
              console.log(dmyACT);

              try{var dmyFORM = cmsg[2].split('-'); var FORM = 'FORMAT'}catch(e){var FORM = 'NO_FORMAT'}

              if (cmsg.length/*implies this is cmsg.0*/ == 2){var year = dmyACT[0]; var month = dmyACT[1]; var day = dmyACT[2]}//RIGHT HERE Error: TypeError: Cannot read property '0' of undefined

              if(FORM == 'FORMAT'){

                if(dmyFORM[0].substring(0,1).toUpperCase() == 'Y' && dmyFORM[1].substring(0,1).toUpperCase() == 'M' && dmyFORM[2].substring(0,1).toUpperCase() == 'D'){var year = dmyACT[0]; var month = dmyACT[1]; var day = dmyACT[2]}
                if(dmyFORM[0].substring(0,1).toUpperCase() == 'M' && dmyFORM[1].substring(0,1).toUpperCase() == 'D' && dmyFORM[2].substring(0,1).toUpperCase() == 'Y'){var year = dmyACT[2]; var month = dmyACT[0]; var day = dmyACT[1]}
                if(dmyFORM[0].substring(0,1).toUpperCase() == 'D' && dmyFORM[1].substring(0,1).toUpperCase() == 'Y' && dmyFORM[2].substring(0,1).toUpperCase() == 'M'){var year = dmyACT[1]; var month = dmyACT[2]; var day = dmyACT[0]}

                if(dmyFORM[0].substring(0,1).toUpperCase() == 'D' && dmyFORM[1].substring(0,1).toUpperCase() == 'M' && dmyFORM[2].substring(0,1).toUpperCase() == 'Y'){var year = dmyACT[2]; var month = dmyACT[1]; var day = dmyACT[0]}
                if(dmyFORM[0].substring(0,1).toUpperCase() == 'M' && dmyFORM[1].substring(0,1).toUpperCase() == 'Y' && dmyFORM[2].substring(0,1).toUpperCase() == 'D'){var year = dmyACT[0]; var month = dmyACT[2]; var day = dmyACT[1]}
                if(dmyFORM[0].substring(0,1).toUpperCase() == 'Y' && dmyFORM[1].substring(0,1).toUpperCase() == 'D' && dmyFORM[2].substring(0,1).toUpperCase() == 'M'){var year = dmyACT[1]; var month = dmyACT[0]; var day = dmyACT[2]}
              }

              var d = new Date(year + '-' + getMonthString(month) + '-' + getDayString(day));
              var desc = 'The Daily Garfield Comic for ' + d.getFullYear() + '-' + getMonthString(d.getMonth() + 1) + '-' + getDayString(d.getDate()) + ' brought to you by LiquidZulu.';
              if(desc !== "The Daily Garfield Comic for NaN-NaN-NaN brought to you by LiquidZulu."){
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

        break;


        case config.SRoMG_prefix + 'SEARCH':

            try {

              if(cmsg[1].split('-').length > 1){

                var date = cmsg[1];
                var format = cmsg[2];

                var dmyACT = cmsg[1].split('-')

                try{var dmyFORM = cmsg[2].split('-'); var FORM = 'FORMAT'}catch(e){var FORM = 'NO_FORMAT'}

                if (cmsg.length/*implies this is cmsg.0*/ == 2){var year = dmyACT[0]; var month = dmyACT[1]; var day = dmyACT[2]}//RIGHT HERE Error: TypeError: Cannot read property '0' of undefined

                if(FORM == 'FORMAT'){

                  if(dmyFORM[0].substring(0,1).toUpperCase() == 'Y' && dmyFORM[1].substring(0,1).toUpperCase() == 'M' && dmyFORM[2].substring(0,1).toUpperCase() == 'D'){var year = dmyACT[0]; var month = dmyACT[1]; var day = dmyACT[2]}
                  if(dmyFORM[0].substring(0,1).toUpperCase() == 'M' && dmyFORM[1].substring(0,1).toUpperCase() == 'D' && dmyFORM[2].substring(0,1).toUpperCase() == 'Y'){var year = dmyACT[2]; var month = dmyACT[0]; var day = dmyACT[1]}
                  if(dmyFORM[0].substring(0,1).toUpperCase() == 'D' && dmyFORM[1].substring(0,1).toUpperCase() == 'Y' && dmyFORM[2].substring(0,1).toUpperCase() == 'M'){var year = dmyACT[1]; var month = dmyACT[2]; var day = dmyACT[0]}

                  if(dmyFORM[0].substring(0,1).toUpperCase() == 'D' && dmyFORM[1].substring(0,1).toUpperCase() == 'M' && dmyFORM[2].substring(0,1).toUpperCase() == 'Y'){var year = dmyACT[2]; var month = dmyACT[1]; var day = dmyACT[0]}
                  if(dmyFORM[0].substring(0,1).toUpperCase() == 'M' && dmyFORM[1].substring(0,1).toUpperCase() == 'Y' && dmyFORM[2].substring(0,1).toUpperCase() == 'D'){var year = dmyACT[0]; var month = dmyACT[2]; var day = dmyACT[1]}
                  if(dmyFORM[0].substring(0,1).toUpperCase() == 'Y' && dmyFORM[1].substring(0,1).toUpperCase() == 'D' && dmyFORM[2].substring(0,1).toUpperCase() == 'M'){var year = dmyACT[1]; var month = dmyACT[0]; var day = dmyACT[2]}
                }

                var d = new Date(year + '-' + getMonthString(month) + '-' + getDayString(day));
                SendSRoMG(message, d);
              }else{

                SendSRoMG(message, cmsg[1], true);
              }
            } 

            catch (e) {
              console.error(e);
              message.channel.send('Error: '+e);
            }

        break;


        case config.SRoMG_prefix + 'JSON':

            if(message.author == me){
              console.log(cmsg)
              readPage(`https://garfield-comics.glitch.me/~SRoMG?SRoMG_NUM=${cmsg[1]}`,   (res) => {
                message.channel.send(`https://garfield-comics.glitch.me/~SRoMG?SRoMG_NUM=${cmsg[1]}



  ${res.body}`) 
              });
            }

        break;


        case config.prefix + 'EMOTE':

          try{message.channel.send(':_`_::' + cmsg[1] + '::_`_:')}catch(e){console.error(e); message.channel.send('Error: '+e);}

        break;


        case config.prefix + 'RANDCOMIC':
        case 'g.random':

          var caseType = 'Random Comic'

            try {

              var d = new Date();

              var date = new Date(RandInt(267087600000, d.getTime() - 1000*60*60*4.5, seed()))
              var desc = 'The Daily Garfield Comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.';

              message.channel.send(EmbedComic(message,desc,genURL(date).comic,genURL(date).comic));
            } 

            catch (e) {
              console.error(e);
              message.channel.send('Error: '+e);
            }

        break;


        case config.SRoMG_prefix + 'RANDCOMIC':

            try {

              var d = new Date();

              var date = new Date(RandInt(1242691200000, d.getTime(), seed()));
              SendSRoMG(message, date);

            } 

            catch (e) {
              console.error(e);
              message.channel.send('Error: '+e);
            }

        break;


        case config.prefix + 'HELP':

                try {
                  message.channel.send(require('./helptext.js'));
                }

                catch (e) {
                  console.error(e);
                  message.channel.send('Error: '+e);
                }

        break;
          
        case `${config.prefix}INIT`:case `${config.SRoMG_prefix}INIT`:
          
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
        
    break;
      
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

app.get('/~SRoMG*', (req, res) => {
  
  foo.OpenDM(me, 'SRoMG JSON request', foo.DM)
  var url = req.query.url;
  
  if(!url){
    if(typeof req.query.date === 'string' && req.query.date.substring(0, 1) !== '"'){
      var dateArr = req.query.date.split('-'),
        year = dateArr[0],
        month = dateArr[1],
        day = dateArr[2];
      var date = new Date(year + '-' + getMonthString(month) + '-' + getDayString(day));
    }else if(typeof req.query.date === 'string' && req.query.date.substring(0, 1) === '"'){
      date = new Date(req.query.date.substring(1, req.query.date.length - 1));
      console.log(date);
    }
  
    var SRoMG_NUM = req.query.SRoMG_NUM;
    try{if(!SRoMG_NUM){var SRoMG_URL = genURL(new Date(date.getTime()/* - 1000*60*60*11*/));}
    else{var SRoMG_URL = {
      SRoMG: ("http://www.mezzacotta.net/garfield/?comic=" + SRoMG_NUM),
      SRoMG_IMG: ('http://www.mezzacotta.net/garfield/comics/' + SRoMG_NUM + '.png')
    }}}catch(e){console.log(e)}
  }else{
    if((/.png/g).test(url.toLowerCase())){
      var PNGmatch = url.toLowerCase().search(/.png/g);
      var SRoMG_NUM = url.substring(PNGmatch - 4, PNGmatch);
      
      var SRoMG_URL = {
        SRoMG: ("http://www.mezzacotta.net/garfield/?comic=" + SRoMG_NUM),
        SRoMG_IMG: ('http://www.mezzacotta.net/garfield/comics/' + SRoMG_NUM + '.png')
      }
    }else{
      var COMICmatch = url.toLowerCase().search(/\?comic=/g);
      var SRoMG_NUM = url.substring(COMICmatch + 7, COMICmatch + 7 + 4);
      
      var SRoMG_URL = {
        SRoMG: ("http://www.mezzacotta.net/garfield/?comic=" + SRoMG_NUM),
        SRoMG_IMG: ('http://www.mezzacotta.net/garfield/comics/' + SRoMG_NUM + '.png')
      }
    }
  }
  var desc = 'Be sure to check out the daily SRoMG comic';
  var url = SRoMG_URL.SRoMG_IMG;
  var link = SRoMG_URL.SRoMG;
  
  readPage(link,   (result) => {
    var meta = getMeta(result.body)
    if(!SRoMG_NUM){desc = 'The daily SRoMG comic for ' + date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + getDayString(date.getDate()) + ' brought to you by LiquidZulu.';}
    else{desc = 'SRoMG comic ' + SRoMG_NUM + ' brought to you by LiquidZulu'} // note improve this, you were lazy by not extracting date from SRoMG comic No., you already did the work in genURL()
    res.send(EmbedComic(null, desc, url, link, meta));
  });

  
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