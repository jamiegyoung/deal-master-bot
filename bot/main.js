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
    client.commands.set(command.name, {
      type: Command,
      command
    });
    console.log(`${prefix}${command.name} added`);
  }
};

client.on('message', message => {
  // Check for prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();
  if (!commandName) return;

  // Check for commands and look through aliases
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.command.aliases && cmd.command.aliases.includes(commandName));


  if (!command) return message.reply('Command does not exist');

  // Check if the channel type is allowed for the command
  if (!command.command.channelTypes.includes(message.channel.type)) return message.channel.send('You cannot use that command in this channel!');

  // See if the user has the permission to perform the command
  if (!command.command.isAdministrator) return command.type.execute(message, args);

  if (message.channel.type === 'dm') console.error('Cannot be channel type dm and require administrator privileges');
  
  if (message.channel.type === 'text') {
    if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR'))
    return message.channel.send(`${message.author}, you do not have the permissions to do that`);
  }

  command.type.execute(message, args);
});

client.login(token);

console.log('bot logged in');
client.commands = new Discord.Collection();
setupCommands();
