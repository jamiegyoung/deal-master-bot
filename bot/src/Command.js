class Command {
  constructor(name, description) {
    this.name = name;
    this.description = description;

    // Below prevents errors if checking length or includes in main
    this.aliases = [];
    this.arguments = [];

    // See all permissions here https://discord.com/developers/docs/topics/permissions
    this.permissions = [];

    // important channel types: dm, text
    this.channelTypes = ['dm', 'text'];
  }

  get commandInfo() {
    const aliases = this.aliases.length ? this.aliases.reduce((aliasString, alias) => `${aliasString} / $${alias}`) : false;
    const args = this.arguments.length ? this.arguments.reduce((arguemntsString, argument) => `${arguemntsString}, ${argument.toLowerCase()}`) : false;
    const command = aliases ? `\`$${this.name} ${args}\` or *$${aliases}*` : `\`$${this.name}\``;
    return `${command}\n${this.description}`;
  }
}

module.exports = Command;
