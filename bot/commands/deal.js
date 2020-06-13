const Command = require('../src/Command');
const dealHandler = require('../src/IsThereAnyDeal');
const { MessageEmbed } = require('discord.js');
const db = require('../src/db');

class Deal extends Command {
  constructor() {
    super('deal', 'Provides deals for the game given');
    super.aliases = ['deals', 'd'];
    super.arguments = ['game'];
    super.channelTypes = ['text'];
    
    this.execute = async (message, args) => {
      const plainNameRes = await dealHandler.getPlainGameName(args[0]);
      if (!plainNameRes) return message.channel.send('Game not found!');
      const country = await db.getCountry(message.channel.id);
      const dealRes = await dealHandler.getDeal(plainNameRes, country);
      if (dealRes.err) return message.channel.send(dealRes.err);
      const dealEmbed = new MessageEmbed()
      .setThumbnail('https://i.imgur.com/G7aw3BJ.jpg')
      .setColor('#E74C3C')
      .setAuthor(`${dealRes.length} Deal${dealRes.length === 1 ? '' : 's'} Found:`, message.client.user.displayAvatarURL())
      .addFields(dealRes)
      .setTimestamp(new Date());

      message.channel.send(dealEmbed);
    };
  }
}

module.exports = Deal;
