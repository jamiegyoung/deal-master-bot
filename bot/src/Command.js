const { prefix } = require('./configs/discord.json');
class Command {
  constructor(name, description) {
    this.name = name;
    this.description = description;

    // Below prevents errors if checking length or includes in main
    this.aliases = [];
    this.arguments = [];

    // See all permissions here https://discord.com/developers/docs/topics/permissions
    this.isAdministrator = true;

    // important channel types: dm, text
    this.channelTypes = ['dm', 'text'];
  }

  get commandInfo() {
    const aliases = this.aliases.length ? this.aliases.reduce((aliasString, alias) => `${aliasString} / ${prefix}${alias}`) : false;
    const args = this.arguments.length ? this.arguments.reduce((argumentsString, argument) => `${argumentsString}, ${argument.toLowerCase()}`) : false;
    const command = aliases ? `\`${prefix}${this.name} ${args}\` or *${prefix}${aliases}*` : `\`${prefix}${this.name} ${args}\``;
    return `${command.trim()}\n${this.description}`;
  }
}

module.exports = Command;
