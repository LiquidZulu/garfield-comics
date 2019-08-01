const Discord = require('discord.js');
const config = require('./config.js');

const embed = new Discord.RichEmbed()
 .setTitle("Invite me to your server here")
 .setAuthor("Garfield Comics Bot | By LiquidZulu")
 .setColor(0x57287d)
 .setDescription("**---You can get support or send feedback [here](https://garfield-comics.glitch.me/feedback) or just DM this bot---**\n\nAll commands need to be prefaced with the prefix: '" + config.prefix + "' or '" + config.SRoMG_prefix + "' for SRoMG specific commands. EXCEPT for 'Show Comic/SRoMG' which can be on their own and have any capitalisation. **All commands case insensitive.**\n\nAlternatively, 'g.' can be used as a prefix where todays comic is g.today and you can search with g.YYYY-MM-DD\nHGrunt (<@396884008501510144>), aka Metal Davis on Church of Jim Davis, syntax can also be used so:\n**!garfeild // !gf // !gar [latest // YYYY-MM-DD]**.\n")
 .setFooter("Made by LiquidZulu")
 .setThumbnail("https://b.thumbs.redditmedia.com/qB90pJUPuQExAp6bYbLAZrvGH1hO7U7bG0IrugEW13E.png")
 .setTimestamp()
 .setURL('https://garfield-comics.glitch.me/')
 .addField("Show Comic",
   "Displays the daily comic.\n\n"
   )
.addField("Show SRoMG",
   "Displays the daily comic.\n\n"
   )
.addField("$init garf/sromg",
   "will set the channel sent in as the channel to send comics in daily"
   )
.addField("$RandComic",
   "Displays a random Garfield comic.\n\n"
   )
.addField("$Search DATE DATE_FORMAT",
   "Shows the comic from a specific date where DATE_FORMAT is the order of year month and day eg: YYYY-MM-DD. You can use upper or lower case and 1 or more characters but must use '-' to splt up the date.\n\n"
   )
.addField("$api || $source",
   "Either $api or $source can be used to display the information website."
   )

module.exports = {embed}