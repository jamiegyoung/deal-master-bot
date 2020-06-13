const { MessageEmbed } = require('discord.js'); 
const Command = require('../src/Command');

class Help extends Command {
  constructor() {
    super('help', 'Gives information about other commands');
    super.aliases = ['h'];
    super.arguments = ['all/command(s)'];
    this.execute = (message, args) => {
      if (!args.length) 
        return message.channel.send('Please enter the commands to get help for, alternatively if you want information about all commands type "$help all"');
  
      const getRequestedCommands = () => {
        const { commands } = message.client;
        if (args[0] === 'all' && args.length === 1) return commands.map(cmd => cmd);
        return args.map(command => commands.get(command)
          || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command)));
      };
  
      const commands = getRequestedCommands();
      if (commands.includes(undefined)) 
        return message.channel.send('Please enter the commands to get help for, alternatively if you want information about all commands type "$help all"');
  
      // if there was a competition for the worst reduce this would probably win
      const getInfo = commands.reduce((finalDescription, cmd) => `${finalDescription}\n${cmd.commandInfo}\n`, '');
  
      const helpEmbed = new MessageEmbed()
        .setTitle('Help has arrived!')
        .setColor('#E74C3C')
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setDescription(getInfo);
  
      message.author.send(helpEmbed);

      // Attempt to delete the initial message
      try {
        if (message.deletable) message.delete();
      } catch (error) {
        message.channel.send('Unable to delete a message, please change permissions!');
      }
    };
  }
} 

module.exports = Help;
