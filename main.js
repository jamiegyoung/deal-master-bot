const Eris = require('eris');
const sqlite3 = require('sqlite3');
const fetch = require('node-fetch');
const login = require('./login.json');
const bundleMessages = require('./bundlemessages.json');
const escapeStringRegexp = require('escape-string-regexp');
const schedule = require('node-schedule');

const db = new sqlite3.Database('database.db');

const client = new Eris.CommandClient(login.discord, {}, {
  defaultHelpCommand: false,
  description: 'A deal bot made by Jam',
  owner: 'Jam',
  prefix: '$',
});

client.connect();

const embedColor = 15158332;
const startDate = new Date();

function sendHumbleMessage(sub, channel, final) {
  client.createMessage(channel.channelID, {
    embed: {
      color: embedColor,
      thumbnail: {
        url: 'https://i.imgur.com/7Tr9b7e.png',
        height: '333',
        width: '2000',
      },
      description: sub,
      fields: final,
      footer: {
        text: `You Can Find Out More At https://www.humblebundle.com`,
      },
      timestamp: new Date(),
    },
  })
    .catch((err) => {
      db.run('DELETE FROM humblechannel WHERE channelID = ?', [channel.channelID], (delErr) => {
        if (delErr) throw err;
      });
      db.run('DELETE FROM monthlychannel WHERE channelID = ?', [channel.channelID], (delErr) => {
        if (delErr) throw err;
      });
    });
}

function generateHumbleBundleMessage(final) {
  db.all('SELECT * FROM humblechannel', (err, row) => {
    if (err) throw err;
    row.forEach((channel) => {
      let sub = '';
      db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [channel.guildID], (subErr, subRow) => {
        if (subErr || subRow.length === 0) {
          sendHumbleMessage(sub, channel, final);
        } else {
          sub = `<@&${subRow[0].roleID}>`;
          sendHumbleMessage(sub, channel, final);
        }
      });
    });
  });
}

function sendChronoMessage(sub, channel, final, imageURL) {
  client.createMessage(channel.channelID, {
    embed: {
      color: embedColor,
      image: {
        url: imageURL,
      },
      description: sub,
      fields: final,
      footer: {
        text: `You Can Find Out More At https://chrono.gg`,
      },
      timestamp: new Date(),
    },
  })
    .catch((err) => {
      db.run('DELETE FROM humblechannel WHERE channelID = ?', [channel.channelID], (delErr) => {
        if (delErr) throw err;
      });
      db.run('DELETE FROM monthlychannel WHERE channelID = ?', [channel.channelID], (delErr) => {
        if (delErr) throw err;
      });
    });
}

function generateChronoMessage(final, imageURL) {
  db.all('SELECT * FROM chronochannel', (err, row) => {
    if (err) throw err;
    row.forEach((channel) => {
      let sub = '';
      db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [channel.guildID], (subErr, subRow) => {
        if (subErr || subRow.length === 0) {
          sendChronoMessage(sub, channel, final, imageURL);
        } else {
          sub = `<@&${subRow[0].roleID}>`;
          sendChronoMessage(sub, channel, final, imageURL);
        }
      });
    });
  });
}

function GetChronoAppDetails(callback) {
  fetch('https://api.chrono.gg/sale')
    .then(chronoRes => chronoRes.json())
    .then((chronoRes) => {
      callback(
        null,
        chronoRes.items[0].id,
        chronoRes.name,
        chronoRes.unique_url,
        chronoRes.promo_image,
        chronoRes.normal_price,
        chronoRes.discount,
        chronoRes.sale_price,
      );
    })
    .catch(() => {
      callback(true);
    });
}

function GetShortGameDescription(appID, callback) {
  fetch(`https://store.steampowered.com/api/appdetails?appids=${appID}`)
    .then(steamRes => steamRes.json())
    .then((steamRes) => {
      callback(steamRes[appID].data.short_description);
    })
    .catch(() => {
      callback(false);
    });
}

function GetChronoDeal() {
  GetChronoAppDetails((err, appID, appName, appURL, imageURL, normalPrice, discount, salePrice) => {
    if (err) return;
    db.run('INSERT INTO chronodeals VALUES (?, ?, "true")', [appID, appName], (insertErr) => {
      if (!insertErr) {
        GetShortGameDescription(appID, (appDescription) => {
          if (appDescription === false) return;
          const final = [
            {
              name: `Chrono.gg's Daily Deal: ${escapeStringRegexp(appName)}`,
              value: `${appDescription}\n**Price** **$${salePrice}** ~~$${normalPrice}~~\n**${discount} Off**\nClick [Here](${appURL}) To Find Out More!\n`,
            },
          ];
          generateChronoMessage(final, imageURL);
        });
        return;
      }
      if (insertErr) throw insertErr;
    });
  });
}

const ruleChrono = new schedule.RecurrenceRule();
ruleChrono.minute = 5;

const jChrono = schedule.scheduleJob(ruleChrono, () => {
  db.all('SELECT appid FROM chronodeals WHERE active = "true"', (selectErr, row) => {
    if (selectErr || row.length === 0) {
      GetChronoDeal();
      return;
    }
    GetChronoAppDetails((err, appID) => {
      if (err) return;
      if (row[0].appid !== appID) {
        db.run('UPDATE chronodeals SET active = "false" WHERE appid = (?)', [row[0].appid], (updateErr) => {
          if (updateErr) throw updateErr;
          GetChronoDeal();
        });
      }
    });
  });
});

function tempChronoTrigger() {
  db.all('SELECT appid FROM chronodeals WHERE active = "true"', (selectErr, row) => {
    if (selectErr || row.length === 0) {
      GetChronoDeal();
      return;
    }
    GetChronoAppDetails((err, appID) => {
      if (err) throw err;
      if (row[0].appid !== appID) {
        db.run('UPDATE chronodeals SET active = "false" WHERE appid = (?)', [row[0].appid], (updateErr) => {
          if (updateErr) throw updateErr;
          GetChronoDeal();
        });
      }
    });
  });
}

const ruleBundle = new schedule.RecurrenceRule();
ruleBundle.minute = [0, 30];

const jBundle = schedule.scheduleJob(ruleBundle, () => {
  fetch('https://hr-humblebundle.appspot.com/androidapp/v2/service_check')
    .then(res => res.json())
    .then((res) => {
      db.all('SELECT * FROM humblebundle WHERE active = "true"', (err, row) => {
        if (!err && row.length !== 0) {
          const activeornot = [];
          for (let x = 0; x < row.length; x += 1) {
            for (let z = 0; z < res.length; z += 1) {
              if (row[x].bundle === res[z].bundle_machine_name) {
                activeornot[x] = { active: true, bundle: row[x].bundle };
                break;
              } else {
                activeornot[x] = { active: false, bundle: row[x].bundle };
              }
            }
          }
          activeornot.forEach((element) => {
            if (element.active === false) {
              db.all('UPDATE humblebundle SET active = "false" WHERE bundle=(?)', [element.bundle], (updateErr) => {
                if (updateErr === false) {
                  console.log(`The bundle ${element.bundle} could not be updated to false`);
                }
              });
            }
          });
        }
      });
      const final = [];
      let finalIndex = 0;
      let requiredIndex = res.length;
      let normal = 0;
      res.forEach((resBundle) => {
        db.all('SELECT * FROM humblebundle WHERE bundle = ?', [resBundle.bundle_machine_name], (err, row) => {
          if (row.length === 0) {
            db.run('INSERT INTO humblebundle (bundle, active) VALUES (?,"true")', [resBundle.bundle_machine_name], (insertErr) => {
              if (insertErr === false) {
                console.log('Error inserting bundle into the database');
              } else if (!resBundle.url.includes('mobile')) {
                const seed = Math.floor(Math.random() * bundleMessages.messages.length);
                const randMessage = bundleMessages.messages[seed][0]
                + escapeStringRegexp(resBundle.bundle_name)
                + bundleMessages.messages[seed][1];
                final[finalIndex] = {
                  name: randMessage,
                  value: `Click [Here](${resBundle.url}) To Find Out More!\n`,
                };
                normal += 1;
                finalIndex += 1;
                if (finalIndex === requiredIndex && normal !== 0) {
                  generateHumbleBundleMessage(final);
                }
              } else {
                requiredIndex -= 1;
                if (finalIndex === requiredIndex && normal !== 0) {
                  generateHumbleBundleMessage(final);
                }
              }
            });
          } else {
            requiredIndex -= 1;
            db.all('UPDATE humblebundle SET active = "true" WHERE bundle = (?)', [resBundle.bundle_machine_name], (updateErr) => {
              if (updateErr === false) {
                console.log('Error updating the bundle in the database');
              }
            });
          }
        });
      });
    });
});


const ruleMonthly = new schedule.RecurrenceRule();
ruleMonthly.dayOfWeek = 5; // Set to 5
ruleMonthly.hour = 18; // Set to 18
ruleMonthly.minute = 0; // 0


const jMonthly = schedule.scheduleJob(ruleMonthly, () => {
  const today = new Date();
  if (today.getDate() <= 7) { // Must be 7
    db.all('SELECT * FROM monthlychannel', (err, row) => {
      if (err || row.length === 0) {
        console.log('No Channels Found');
      } else {
        row.forEach((channel) => {
          let sub = ``;
          const final = [{
            name: `The New Humble Monthly Bundle Has Arrived!`,
            value: `Click [Here](https://www.humblebundle.com/monthly) For More Information!`,
          }];
          db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [channel.guildID], (selectErr, selectRow) => {
            if (selectRow.length === 0) {
              sendHumbleMessage(sub, channel, final);
            } else {
              sub = `<@&${selectRow[0].roleID}>`;
              sendHumbleMessage(sub, channel, final);
            }
          });
        });
      }
    });
  }
});

client.on('ready', () => {
  console.log(`The bot is online: ${startDate}`);
});

client.registerCommand('deal', (message, args) => {
  const searchGame = args.join(' ');
  fetch(`https://api.isthereanydeal.com/v02/game/plain/?key=${login.api.isthereanydeal}&title=${searchGame}`)
    .then(titleres => titleres.json())
    .then((titleres) => {
      const game = titleres.data.plain;
      if (game) {
        let currencychar = '';
        db.all('SELECT currency FROM currency WHERE server = (?)', [message.channel.guild.id], (err, row) => {
          if (err || row.length === 0) {
            message.channel.createMessage('Error: Please select a country (e.g "US", "UK", "EU") using the command $setcountry (currency)\nA simple list can be found here: http://sustainablesources.com/resources/country-abbreviations/\nIf an invalid country is selected, prices will default to the US\nIf your country\'s currency is not currently supported, give <@167850724976361472> a message with the country and currency not supported');
          } else {
            const country = row[0].currency;
            switch (country) {
              case 'UK':
              case 'GB':
                currencychar = '£';
                break;
              case 'US':
                currencychar = '$';
                break;
              case 'AD':
              case 'AT':
              case 'BE':
              case 'CY':
              case 'EE':
              case 'FI':
              case 'FR':
              case 'DE':
              case 'GR':
              case 'IE':
              case 'IT':
              case 'LV':
              case 'LT':
              case 'LU':
              case 'MT':
              case 'MC':
              case 'ME':
              case 'AN':
              case 'PT':
              case 'SM':
              case 'SK':
              case 'SI':
              case 'ES':
              case 'VA':
                currencychar = '€';
                break;
              default:
                currencychar = '$';
                break;
            }
            fetch(`https://api.isthereanydeal.com/v01/game/prices//?key=${login.api.isthereanydeal}&plains=${game}&country=${country}`)
              .then(res => res.json())
              .then((res) => {
                if (res.data[game].list.length !== 0) {
                  let amount;
                  if (res.data[game].list.length > 5) {
                    amount = 5;
                  } else {
                    amount = res.data[game].list.length;
                  }
                  let newAmt = 0;
                  let looperr = false;
                  const final = [];
                  for (let x = 0; x < amount; x += 1) {
                    if (res.data[game].list[x].price_cut !== 0) {
                      final[x] = {
                        name: escapeStringRegexp(res.data[game].list[x].shop.name),
                        url: escapeStringRegexp(res.data[game].list[x].url),
                        value: `**Price: **${currencychar}${res.data[game].list[x].price_new} ~~${currencychar}${res.data[game].list[x].price_old}~~\n**${res.data[game].list[x].price_cut}% Off**\n**[Link](${res.data[game].list[x].url})**`,
                      };
                      newAmt += 1;
                    } else if (x === 0) {
                      looperr = true;
                      break;
                    }
                  }
                  if (looperr === true) {
                    message.channel.createMessage('No Deals Found');
                  } else {
                    let preAmt = 'Deals';
                    if (newAmt === 1) preAmt = 'Deal';
                    message.channel.createMessage({
                      embed: {
                        color: embedColor,
                        thumbnail: {
                          url: 'https://i.imgur.com/G7aw3BJ.jpg',
                        },
                        author: {
                          name: `${newAmt} ${preAmt} Found:`,
                          icon_url: client.user.staticAvatarURL,
                        },
                        fields: final,
                        timestamp: new Date(),
                      },
                    });
                  }
                } else {
                  message.channel.createMessage('Game Not Found');
                }
              });
          }
        });
      } else {
        message.channel.createMessage('Game Not Found');
      }
    });
}, {
  desription: 'Find Deals',
  fullDescription: 'Type the game name after the command and find deals!',
  caseInsensitive: true,
  argsRequired: true,
  guildOnly: true,
});

client.registerCommandAlias('deals', 'deal', {
  caseInsensitive: false,
});

client.registerCommand('setcountry', (message, rawArgs) => {
  const notFound = 'Error: Invalid country (e.g "US", "UK", "EU")\nA simple list can be found here: http://sustainablesources.com/resources/country-abbreviations/\nIf an invalid country is selected, prices will default to the US\nIf your country\'s currency is not currently supported, give <@167850724976361472> a message with the country and currency not supported';
  const args = rawArgs[0].toUpperCase();
  db.all('SELECT * FROM currency WHERE server = (?)', [message.channel.guild.id], (selectErr, row) => {
    if (selectErr || row.length === 0) {
      if (args.length === 2) {
        db.run('INSERT INTO currency (server, currency) values (?,?)', [message.channel.guild.id, args], (insertErr) => {
          if (insertErr === false) {
            message.channel.createMessage('Error: Currency could not be saved');
            console.log(`could not insert server ${message.channel.guild.id} into the db`);
          } else {
            message.channel.createMessage(`Successfully set the currency for the server ${message.channel.guild.name} to ${args}`);
          }
        });
      } else {
        message.channel.createMessage(notFound);
      }
    } else if (args.length === 2) {
      db.all('UPDATE currency SET currency=(?) WHERE server=(?)', [args, message.channel.guild.id], (err) => {
        if (err === false) {
          message.channel.createMessage('Error: Currency could not be changed');
          console.log(`could not remove previous records for the server: ${message.channel.guild.id}`);
        } else {
          message.channel.createMessage(`Successfully replaced the currency for the server \`${message.channel.guild.name}\` to \`${args}\``);
        }
      });
    } else {
      message.channel.createMessage(notFound);
    }
  });
}, {
  requirements: {
    permissions: { administrator: true },
  },
  desription: 'Set Country',
  fullDescription: 'Set the country using the abbreviation',
  caseInsensitive: true,
  argsRequired: true,
  guildOnly: true,
});

client.registerCommand('country', (message) => {
  db.all('SELECT * FROM currency WHERE server = (?)', [message.channel.guild.id], (err, row) => {
    if (err || row.length === 0) {
      message.channel.createMessage(`The server ${message.channel.guild.name} does not have a country assigned`);
    } else {
      message.channel.createMessage(`The server \`${message.channel.guild.name}\` has the country ${row[0].currency} assigned to it`);
    }
  });
}, {
  desription: 'Show Country',
  fullDescription: 'Shows the country assigned to the guild',
  caseInsensitive: true,
  guildOnly: true,
});

client.registerCommand('subscribe', (message, args) => {
  if (args.length === 0) {
    message.addReaction('⏱');
    db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [message.channel.guild.id], (err, row) => {
      if (err || row.length === 0) {
        message.removeReaction('⏱');
        message.addReaction('👎');
        message.channel.createMessage('Please subscribe a role first before subscribing using $rolesubscribe');
      } else {
        message.member.addRole(row[0].roleID)
          .then(() => {
            message.removeReaction('⏱');
            message.addReaction('👌');
          })
          .catch(() => {
            message.removeReaction('⏱');
            message.addReaction('👎');
            message.channel.createMessage('Unsuccessful! I am too weak!');
          });
      }
    });
  }
});

client.registerCommandAlias('sub', 'subscribe');

client.registerCommand('unsubscribe', (message) => {
  message.addReaction('⏱');
  db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [message.channel.guild.id], (err, row) => {
    if (!err && row.length !== 0) {
      let found = false;
      for (let x = 0; x < message.member.roles.length; x += 1) {
        if (message.member.roles[x] === row[0].roleID) {
          found = true;
          message.member.removeRole(row[0].roleID)
            .then(() => {
              message.removeReaction('⏱');
              message.addReaction('👌');
            })
            .catch(() => {
              message.removeReaction('⏱');
              message.addReaction('👎');
              message.channel.createMessage('Unsuccessful! I am too weak!');
            });
          break;
        }
      }
      if (found === false) {
        message.removeReaction('⏱');
        message.addReaction('👎');
        message.channel.createMessage('You do not have any role to unsubscribe from!');
      }
    }
  });
});

client.registerCommandAlias('unsub', 'unsubscribe');

client.registerCommand('rolesubscribe', (message, args) => {
  // const role = message.channel.guild.roles.find(r => r.name === args[0]);
  let checkingRole = args[0];
  if (args[0].startsWith('<@&') && args[0].endsWith('>')) {
    checkingRole = args[0].substring(3, args[0].length - 1);
  }
  const role = message.channel.guild.roles.find(r => r.name === checkingRole || r.id === checkingRole);
  if (role) {
    const roleID = role.id;
    const roleName = role.name;
    db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [message.channel.guild.id], (err, row) => {
      if (err || row.length === 0) {
        db.run('INSERT INTO subscriberRoleID (guildID,roleID) values (?,?)', [message.channel.guild.id, roleID], (insertErr) => {
          if (insertErr) {
            console.log('error on inserting into subscriberRoleID');
          } else {
            message.channel.createMessage(`Successfully Subscribed The Role \`${roleName}\` To Humble Bundle Notifications!`);
          }
        });
      } else {
        db.all('UPDATE subscriberRoleID SET roleID=(?) WHERE guildID=(?)', [roleID, message.channel.guild.id], (updateErr) => {
          if (updateErr) {
            console.log('error on updating subscribeRoleID');
          } else {
            message.channel.createMessage(`Updated Subscribed Role To ${roleName}, Previous Subscribers Will Have To Resubscribe`);
          }
        });
      }
    });
    message.channel.createMessage(`<@&${roleID}>`);
  } else {
    message.channel.createMessage(`There is no role called ${args.join(' ')} (warning case-sensitive)`);
  }
}, {
  requirements: {
    permissions: { administrator: true },
  },
  desription: 'Set Subscribed Role',
  caseInsensitive: false,
  argsRequired: true,
  guildOnly: true,
});
client.registerCommandAlias('rolesub', 'rolesubscribe');
client.registerCommandAlias('subrole', 'rolesubscribe');
client.registerCommandAlias('subscriberole', 'rolesubscribe');

client.registerCommand('roleunsubscribe', (message) => {
  db.all('SELECT roleID FROM subscriberRoleID WHERE guildID = (?)', [message.channel.guild.id], (err, row) => {
    if (err || row.length === 0) {
      message.channel.createMessage('No Role Is Subscribed On This Server');
    } else {
      db.run('DELETE FROM subscriberRoleID WHERE guildID = ?', [message.channel.guild.id], (deleteErr) => {
        if (deleteErr) {
          console.log('error deleting from subscriberRoleID');
        } else {
          message.channel.createMessage('Successfully Unsubscribed');
        }
      });
    }
  });
}, {
  requirements: {
    permissions: { administrator: true },
  },
  desription: 'Unsubscribe Role',
  caseInsensitive: true,
  guildOnly: true,
});

client.registerCommandAlias('roleunsub', 'roleunsubscribe');
client.registerCommandAlias('unsubrole', 'roleunsubscribe');
client.registerCommandAlias('unsubscriberole', 'roleunsubscribe');


client.registerCommand('bundles', (message, args) => {
  if (args.length === 0 || args[0] === 'check') {
    db.all('SELECT channelID FROM humblechannel WHERE channelID = (?)', [message.channel.id], (err, row) => {
      if (err || row.length === 0) {
        message.channel.createMessage('Humble Bundle Notifications Are Currently Off For this Channel!');
      } else {
        message.channel.createMessage('Humble Bundles Notifications Are Currently On For This Channel!');
      }
    });
  } else if (args[0] === 'on') {
    db.all('SELECT channelID FROM humblechannel WHERE channelID = (?)', [message.channel.id], (err, row) => {
      if (err || row.length === 0) {
        db.run('INSERT INTO humblechannel (channelID,guildID) VALUES (?,?)', [message.channel.id, message.channel.guild.id], (insertErr) => {
          if (insertErr) {
            console.log('error on insertion to humblechannel');
          } else {
            message.channel.createMessage('Started Bundle Notifications!');
          }
        });
      } else {
        message.channel.createMessage('Bundle Notifications Are Already On For This Channel!');
      }
    });
  } else if (args[0] === 'off') {
    db.run('DELETE FROM humblechannel WHERE channelID = ?', [message.channel.id], (err) => {
      if (err) {
        message.channel.createMessage('Bundle Notifications Are Already Off For This Channel!');
      } else {
        message.channel.createMessage('Stopped Bundle Notifications');
      }
    });
  }
}, {
  requirements: {
    permissions: { administrator: true },
  },
  desription: 'Bundles',
  caseInsensitive: true,
  guildOnly: true,
});
client.registerCommandAlias('humble', 'bundles');
client.registerCommandAlias('humblebundle', 'bundles');
client.registerCommandAlias('bundle', 'bundles');

client.registerCommand('humblemonthly', (message, args) => {
  if (args.length === 0 || args[0] === 'check') {
    db.all('SELECT channelID FROM monthlychannel WHERE channelID = (?)', [message.channel.id], (err, row) => {
      if (err || row.length === 0) {
        message.channel.createMessage('Humble Monthly Notifications Are Currently Off For This Channel!');
      } else {
        message.channel.createMessage('Humble Monthly Notifications Are Currently On For This Channel!');
      }
    });
  } else if (args[0] === 'on') {
    db.all('SELECT channelID FROM monthlychannel WHERE channelID = (?)', [message.channel.id], (err, row) => {
      if (err || row.length === 0) {
        db.run('INSERT INTO monthlychannel (channelID, guildID) VALUES (?,?)', [message.channel.id, message.channel.guild.id], (insertErr) => {
          if (insertErr) {
            console.log('error on insertion to monthlychannel');
          } else {
            message.channel.createMessage('Started Humble Monthly Bundle Notifications!');
          }
        });
      } else {
        message.channel.createMessage('Humble Monthly Notifications Are Already On For This Channel!');
      }
    });
  } else if (args[0] === 'off') {
    db.run('DELETE FROM monthlychannel WHERE channelID = ?', [message.channel.id], (err) => {
      if (err) {
        message.channel.createMessage('Humble Monthly Bundle Notifications Are Already Off For This Channel');
      } else {
        message.channel.createMessage('Stopped Humble Monthly Bundle Motifications');
      }
    });
  }
}, {
  requirements: {
    permissions: { administrator: true },
  },
  desription: 'Humble Monthly',
  caseInsensitive: true,
  guildOnly: true,
});
client.registerCommandAlias('monthly', 'humblemonthly');

client.registerCommand('chrono', (message, args) => {
  if (args.length === 0 || args[0] === 'check') {
    db.all('SELECT channelID FROM chronochannel WHERE channelID = (?)', [message.channel.id], (err, row) => {
      if (err || row.length === 0) {
        message.channel.createMessage('Chrono Daily Deal Notifications Are Currently Off For this Channel!');
      } else {
        message.channel.createMessage('Chrono Daily Deal Notifications Are Currently On For This Channel!');
      }
    });
  } else if (args[0] === 'on') {
    db.all('SELECT channelID FROM chronochannel WHERE channelID = (?)', [message.channel.id], (err, row) => {
      if (err || row.length === 0) {
        db.run('INSERT INTO chronochannel (channelID,guildID) VALUES (?,?)', [message.channel.id, message.channel.guild.id], (insertErr) => {
          if (insertErr) {
            console.log('error on insertion to chronochannel');
          } else {
            message.channel.createMessage('Started Chrono Notifications!');
          }
        });
      } else {
        message.channel.createMessage('Chrono Notifications Are Already On For This Channel!');
      }
    });
  } else if (args[0] === 'off') {
    db.run('DELETE FROM chronochannel WHERE channelID = ?', [message.channel.id], (err) => {
      if (err) {
        message.channel.createMessage('Chrono Notifications Are Already Off For This Channel!');
      } else {
        message.channel.createMessage('Stopped Chrono Notifications');
      }
    });
  }
}, {
  requirements: {
    permissions: { administrator: true },
  },
  desription: 'Chrono',
  caseInsensitive: true,
  guildOnly: true,
});

function deleteMessages(message, amount) {
  message.channel.getMessages(amount + 1)
    .then((res) => {
      for (let x = 1; x < res.length; x += 1) {
        message.channel.deleteMessage(res[x].id)
          .catch(() => false);
      }
      message.delete();
    });
}

client.registerCommand(
  'prune', (message, args) => {
    if (args.length === 0) {
      message.addReaction('⏱');
      deleteMessages(message, 100);
      return;
    }
    const parsed = parseInt(args[0], 10);
    if (!Number.isNaN(parsed)) {
      message.addReaction('⏱');
      deleteMessages(message, parsed);
    }
  },
  {
    requirements: {
      permissions: { administrator: true },
    },
    caseInsensitive: true,
  },
);

client.registerCommand('uptime', (message, args) => {
  if (args.length === 0) {
    const uptimeDate = new Date();
    const timeDiff = Math.abs(uptimeDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const after = () => {
      if (diffDays === 1) return "day";
      return "days";
    };
    message.channel.createMessage(`The bot has been up for ${diffDays} ${after()}`);
  }
}, {
  caseInsensitive: true,
});

