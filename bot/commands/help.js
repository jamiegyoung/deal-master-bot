const { MessageEmbed } = require('discord.js'); 
const Command = require('../src/Command');

class Help extends Command {
  constructor() {
    super('help', 'Gives information about other commands');
    super.aliases = ['h'];
    super.isAdministrator = false;
    super.arguments = ['all/command(s)'];
  }

  static getRequestedCommands (client, args) {
    const { commands } = client;
    if (args[0] === 'all' && args.length === 1) return commands.map(cmd => cmd.command);
    return args.map(command => {
      if (commands.get(command)) {
        return commands.get(command).command;
      }
      try {
        return commands.find(cmd => cmd.command.aliases && cmd.command.aliases.includes(command)).command;
      } catch (err) {
        return false;
      }
    });
  }

  static parseCommandInfo (commands) {
    const sortedCommands = Help.sortCommands(commands);

    const adminCommandInfo = sortedCommands.admin.reduce((finalDescription, commandInfo) => `${finalDescription}\n${commandInfo}\n`, '');
    const userCommandInfo = sortedCommands.user.reduce((finalDescription, commandInfo) => `${finalDescription}\n${commandInfo}\n`, '');

    return `${userCommandInfo.length ? `**--- USER COMMANDS ---**\n${userCommandInfo}` : ''}
      ${adminCommandInfo.length ? `**--- ADMIN COMMANDS ---**\n${userCommandInfo}` : ''}`;
  }

  static sortCommands(commands) {
    return commands.reduce((finalCommandList, cmd) => {
      if (cmd.isAdministrator) {
        finalCommandList.admin.push(cmd.commandInfo);
        return finalCommandList;
      }
      finalCommandList.user.push(cmd.commandInfo);
      return finalCommandList;
    }, {
      admin: [],
      user: [],
    });
  }

  static execute (message, args) {
    if (!args.length) 
      return message.channel.send('Please enter the commands to get help for, alternatively if you want information about all commands type "$help all"');

    const commands = Help.getRequestedCommands(message.client, args);
    if (commands.includes(false))
      return message.channel.send('Please enter the commands to get help for, alternatively if you want information about all commands type "$help all"');
  
    const commandInfo = Help.parseCommandInfo(commands);

    const helpEmbed = new MessageEmbed()
      .setTitle('Help has arrived!')
      .setColor('#E74C3C')
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      .setDescription(commandInfo);

    message.author.send(helpEmbed);
    // Attempt to delete the initial message
    try {
      if (message.deletable) message.delete();
    } catch (error) {
      message.channel.send('Unable to delete a message, please change permissions!');
    }
  }
} 

module.exports = Help;
