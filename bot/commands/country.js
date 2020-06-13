const Command = require('../src/Command');
const db = require('../src/db');

class Country extends Command {
  constructor() {
    super('country', 'Checks the country that a channel has been assigned');
    super.channelTypes = ['text'];
    this.execute = async message => {
      const country = await db.getCountry(message.channel.id);
      if (country) return message.channel.send(`The channel's country code is ${country}`);
      message.channel.send('The channel has not been assigned a country');
    };
  }
}

module.exports = Country;
