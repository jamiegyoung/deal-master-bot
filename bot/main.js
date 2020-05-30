const fs = require('fs')
const Discord = require('discord.js');
const { prefix, token } = require('./configs/discord.json');

/**
 * Dynamically setup commands from commands folder
 */
const setupCommands = () => {
  const commandFiles = fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
}

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.login(token)
setupCommands();

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();

  // Check for commands and look through aliases
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return message.reply('Command does not exist');

  try {
    if (command.permissionRequirement) {
      for (const permission of command.permissionRequirement) {
        if (!message.guild.member(message.author).hasPermission(permission.toUpperCase()))
          return message.channel.send(`${message.author}, you do not have the permissions to do that`)
      }
    }

    command.execute(message, args);
  } catch (error) {
    console.error(error) // Remove
    message.reply('Command does not exist')
  }
})