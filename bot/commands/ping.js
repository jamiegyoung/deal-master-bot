const Command = require('../src/Command');

class Ping extends Command {
  constructor() {
    super('ping', 'Returns to sender');
    super.isAdministrator = false;
  }

  static execute (message) {
    message.channel.send('Pong!');
  }
}

module.exports = Ping;
