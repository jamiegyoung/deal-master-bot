const fs = require('fs');
const { admins } = require('../configs/discord.json');

module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  aliases: ['refresh', 'r'],
  execute(message, args) {
    if (!admins.includes(message.author.id)) return message.channel.send(`You aren't able to do that! ${message.author}`);
    if (!args.length) return message.channel.send(`You didn' pass a command to reload, ${message.author}`);

    for (const command of args) {
      const commandFiles = fs.readdirSync('./commands')
        .filter(file => file.endsWith('.js'))
        .map(command => command.slice(0, -3));

      if (!commandFiles.includes(command)) return message.channel.send(`Command "${command}" does not exist`);
      delete require.cache[require.resolve(`./${command}.js`)];

      try {
        const newCommand = require(`./${command}.js`);
        message.client.commands.set(newCommand.name, newCommand);
        return message.channel.send('Successfully reloaded command');
      } catch (error) {
        return message.channel.send(`There was an error when reloading the command ${command.name}`);
      }
    }
  },
};
