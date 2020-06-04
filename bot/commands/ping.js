const Command = require('../src/Command');

class Ping extends Command {
  constructor() {
    super('ping', 'Returns to sender');
    this.execute = message => {
      message.channel.send('Pong!');
    };
  }
}

module.exports = Ping;
