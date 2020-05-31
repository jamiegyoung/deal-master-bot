const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Gives information about other commands',
  aliases: ['h'],
  arguments: ['all/command(s)'],
  execute(message, args) {
    // Check for args
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
    const commandInfo = commands.reduce((finalDescription, cmd) => {
      const aliases = cmd.aliases ? cmd.aliases.reduce((aliasString, alias) => `${aliasString} / $${alias}`) : false;
      const cmdArgs = cmd.arguments ? cmd.arguments.reduce((arguemntsString, argument) => `${arguemntsString}, ${argument}`) : false;
      const command = aliases ? `\`$${cmd.name} ${cmdArgs}\` *$${aliases}*` : `\`$${cmd.name}\``;
      return `${finalDescription} ${command}\n${cmd.description}\n\n`;
    }, '');

    const helpEmbed = new MessageEmbed()
      .setTitle('Help has arrived!')
      .setColor('#E74C3C')
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      .setDescription(commandInfo);

    message.author.send(helpEmbed);
  }
};
