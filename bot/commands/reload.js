const fs = require('fs');
const { admins } = require('../configs/discord.json');
const Command = require('../src/Command');

class Reload extends Command {
  constructor() {
    super('reload', 'Reloads a command');
    super.aliases = ['refresh', 'r'];
    super.arguments = ['command(s)'];
    this.execute = (message, args) => {
      // Make sure only admins of the bot can reload commands
      if (!admins.includes(message.author.id)) return message.channel.send(`You aren't able to do that ${message.author}!`);
      if (!args.length) return message.channel.send(`You didn' pass a command to reload, ${message.author}`);
  
      for (const command of args) {
        const commandFiles = fs.readdirSync('./commands')
          .filter(file => file.endsWith('.js'))
          .map(command => command.slice(0, -3));
  
        if (!commandFiles.includes(command)) return message.channel.send(`Command "${command}" does not exist`);

        try {
          // Reload the command in cache
          delete require.cache[require.resolve(`./${command}.js`)];
          const Command = require(`./${command}.js`);
          const newCommand = new Command();
          message.client.commands.set(newCommand.name, newCommand);
          console.log(`Successfully reloaded $${newCommand.name}`);
          return message.channel.send('Successfully reloaded command');
        } catch (error) {
          return message.channel.send(`There was an error when reloading the command ${command.name}`);
        }
      }
    };
  }
}

module.exports = Reload;
