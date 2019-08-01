const discord = require('discord.js');
const client = new discord.Client();

module.exports = {
  OpenDM: async (user, message, _callback) => {
    
    await user.createDM;
    _callback(user, message)
  },
  
  DM: (user, message) => {
    
    user.send(message)
      .then(message => console.log(`Sent DM: ${message.content}`))
       .catch(console.error);
  }
}