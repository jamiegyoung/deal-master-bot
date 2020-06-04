class Command {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.aliases = [];
    this.arguments = [];
    this.permissions = [];
  }

  get commandInfo() {
    const aliases = this.aliases.length ? this.aliases.reduce((aliasString, alias) => `${aliasString} / $${alias}`) : false;
    const args = this.arguments.length ? this.arguments.reduce((arguemntsString, argument) => `${arguemntsString}, ${argument.toLowerCase()}`) : false;
    const command = aliases ? `\`$${this.name} ${args}\` *$${aliases}*` : `\`$${this.name}\``;
    return `${command}\n${this.description}`;
  }

}

module.exports = Command;
