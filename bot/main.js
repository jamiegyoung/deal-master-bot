const { prefix, token } = require('./configs/discord.json');
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();

 // Dynamically setup commands from commands folder
const setupCommands = () => {
  console.log('setting up commands');
  const commandFiles = fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const Command = require(`./commands/${file}`);
    const command = new Command();
    client.commands.set(command.name, command);
    console.log(`$${command.name} added`);
  }
};

client.on('message', message => {
  // Check for prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();

  // Check for commands and look through aliases
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return message.reply('Command does not exist');

  // Check if the channel type is allowed for the command
  if (!command.channelTypes.includes(message.channel.type)) return message.channel.send('You cannot use that command in this channel!');

  // Attempt to see if the user has the permission
  if (!command.permissions.length) return command.execute(message, args);

  for (const permission of command.permissions) {
    if (!message.guild.member(message.author).hasPermission(permission.toUpperCase()))
      message.channel.send(`${message.author}, you do not have the permissions to do that`);
  }
});

client.login(token);

console.log('bot logged in');
client.commands = new Discord.Collection();
setupCommands();
