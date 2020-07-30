const Command = require('../src/Command');
const db = require('../src/db');
const { prefix } = require('./configs/discord.json');
// TODO: Add list of countries
class SetCountry extends Command {
  constructor() {
    super('setcountry', 'Sets what country/currency that channel will be using');
    super.arguments = ['country'];
    super.channelTypes = ['text'];
  }

  static async execute (message, args) {
    if (!args.length) return message.channel.send(`This command takes one argument, use ${prefix}help for more information`);
    if (args.length > 1) return message.channel.send(`This command only takes one argument, use ${prefix}help for more information`);
    if (args[0].length > 2) return message.channel.send('Please enter a valid country code!');
    
    const currentCountry = await db.getCountry(message.channel.id);
    if (!currentCountry) {
      // TODO: Add method to create a new entry in the db
      console.error('failed to insert into database');
      return message.channel.send('Something went wrong!');
    }
    if (currentCountry === args[0].toUpperCase()) return message.channel.send('This channel has already been assigned that country');
    const res = await db.setCountry(message.channel.id, args[0]);
    if (res) return message.channel.send(`Successfully updated the channel's country to ${args[0].toUpperCase()}!`);
  }
}

module.exports = SetCountry;
