const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Gives information about other commands',
  aliases: ['h'],
  execute(message, args) {
    if (!args.length) 
      return message.channel.send('Please enter the commands to get help for, alternatively if you want information about all commands type "$help all"');
    
    const getRequestedCommands = () => {
      const { commands } = message.client;
      if (args[0] === 'all') return commands.map(cmd => cmd)
      // return commands.filter(command => args.includes(command.name)
      return args.map(command => commands.get(command)
        || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command)));
    }

    const commands = getRequestedCommands();
    if (commands.includes(undefined)) 
      return message.channel.send('Please enter the commands to get help for, alternatively if you want information about all commands type "$help all"');
    
    const commandInfo = commands.map(cmd => ({
      name: (cmd.aliases ? `$${cmd.name} | $${cmd.aliases.reduce((finalAliasList, alias) => `${finalAliasList} | $${alias}`)}` : `$${cmd.name}`),
      value: `${cmd.description}`
    }));

    const helpEmbed = new MessageEmbed()
      .setTitle('Help!')
      .setColor('#E74C3C')
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
      .addFields(commandInfo)

    message.author.send(helpEmbed);
  }
}
