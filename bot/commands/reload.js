const fs = require('fs');
const { admins } = require('../configs/discord.json');

module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  aliases: ['refresh', 'r'],
  execute(message, args) {
    console.log(`${admins} + ${message.author.id}`)
    if (!admins.includes(message.author.id)) return message.channel.send(`You aren't able to do that! ${message.author}`);
    if (!args.length) return message.channel.send(`You didn' pass a command to reload, ${message.author}`)

    for (const command of args) {
      const commandFiles = fs.readdirSync('./commands')
        .filter(file => file.endsWith('.js'))
        .map(command => command.slice(0, -3))

      if (!commandFiles.includes(command)) return message.channel.send(`Command "${command}" does not exist`);
      delete require.cache[require.resolve(`./${command}.js`)]

      try {
        const newCommand = require(`./${command}.js`)
        message.client.commands.set(newCommand.name, newCommand)
        message.channel.send('Successfully reloaded command')
      } catch (error) {
        console.log(error);
        message.channel.send(`There was an error when reloading the command ${command.name}`)
      }
    }
  }
}