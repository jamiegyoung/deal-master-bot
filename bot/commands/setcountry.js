const Command = require('../src/Command');
const db = require('../src/db');

// TODO: Add list of countries
class Ping extends Command {
  constructor() {
    super('setcountry', 'Sets what country/currency that channel will be using');
    super.arguments = ['country'];
    super.channelTypes = ['text'];

    this.execute = async (message, args) => {
      if (!args.length) return message.channel.send('This command takes one argument, use $help for more information');
      if (args.length > 1) return message.channel.send('This command only takes one argument, use $help for more information');
      if (args[0].length > 2) return message.channel.send('Please enter a valid country code!');
      
      const currentCountry = await db.getCountry(message.channel.id);
      if (!currentCountry) 
      if (currentCountry === args[0].toUpperCase()) return message.channel.send('This channel has already been assigned that country');
      const res = await db.setCountry(message.channel.id, args[0]);
      if (res) return message.channel.send(`Successfully updated the channel's country to ${args[0].toUpperCase()}!`);
    };
  }
}

module.exports = Ping;
