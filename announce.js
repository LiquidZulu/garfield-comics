const Discord = require('discord.js');
const config = {
  prefix: '$',
  SRoMG_prefix: '$$',
  invite: 'https://discordapp.com/oauth2/authorize?client_id=343741669507858442&scope=bot&permissions=540400640'
}

const foo = {
  OpenDM: async (user, message, _callback) => {
    
    await user.createDM;
    _callback(user, message)
  },
  
  DM: (user, message) => {
    
    user.send(message)
      .then(message => console.log(`Sent DM: ${message.content}`))
       .catch(console.error);
  },
}

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.TOKEN;
client.login(token);

client.on('ready', () => {
  console.log('\n\n\nANNOUNCEMENT READY\n\n\n');
  
    for(var i=0; i<client.guilds.array().length; i++){
      console.log('started');
      try {client.guilds.find('id', client.guilds.array()[i].id).channels.find('id', client.guilds.array()[i].id).send(process.argv[2])}
      catch(e) {(foo.OpenDM(client.guilds.find('id', client.guilds.array()[i].id).owner, process.argv[2], foo.DM))}
      
      //foo.OpenDM(message.guild.owner, 'LIKELY RAID ON GUILD ' + message.guild.id + ' (' + message.guild.name + ')\n\nLIKELY RAIDERS: ' + guildData[message.guild.id].authMentionable, foo.DM)
    }
});