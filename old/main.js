const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');


var eventDate = new Date();
client.on('ready',() =>{
    console.log('The bot is online: ' + eventDate);
});

client.on("ready", () => {
    client.user.setGame("$help for more information");
});

function commandIs(str, msg){
    return msg.content.toLowerCase().startsWith("$" + str);
}

client.on('message', message => {
	if(message.channel.name){
		if(message.channel.name.toLowerCase() == "deals" || message.channel.name.toLowerCase() == "gamedeals" ){
			if(commandIs("deal", message || commandIs("deals",message))){
				var args = message.content.replace('s ','');
				var args = args.replace('$deal', '');
				handleDeals(args,message);
			} else if(commandIs("help",message)){
				message.reply("\n***Command Key:*** $\n**Commands:**\n•$deals\n•$help\n•$setcountry\n•$country");
			} else if(commandIs("setcountry",message)){
				if(message.channel.name){
					if(message.channel.name.toLowerCase() == "deals" || message.channel.name.toLowerCase() == "gamedeals" ){
						var args = message.content.replace('$setcountry ','');
						var args = args.toUpperCase();
						db.all('SELECT * FROM currency WHERE server = (?)',[message.guild.id],(err,row) =>{
							if(err || row.length === 0){
								if(args.length === 2){
									db.run('INSERT INTO currency values (?,?)', [message.guild.id, args],(err)=>{	
										if(err === false){
											message.reply("Error: Currency could not be saved");
											console.log("could not insert server " + message.guild.id + " into the db");
										} else{
											message.reply("Successfully set the currency for the server `" + message.guild.name + "` to " + args);
										}
									});
								} else{
									message.reply("Error: Invalid country (e.g 'US', 'UK', 'EU')\nA simple list can be found here: http://sustainablesources.com/resources/country-abbreviations/\nIf an invalid country is selected, prices will default to the US");
								}	
							} else{
								if(args.length === 2){
									db.all('DELETE FROM currency WHERE server = (?)',[message.guild.id],(err,row) =>{
										if(err === false){
											message.reply("Error: Currency could not be changed");
											console.log("could not remove previous records for the server: " + message.guild.id);
										} else{
											console.log("Successfully removed the previous records");
											db.run('INSERT INTO currency values (?,?)', [message.guild.id, args],(err)=>{	
												if(err === false){
													message.reply("Error: Currency could not be saved");
													console.log("could not insert server " + message.guild.id + " into the db");
												} else{
													message.reply("Successfully replaced the currency for the server `" + message.guild.name + "` to " + args);
													console.log("replaced: " + message.guild.id);
												}
											});
										}
									});
								} else{
									message.reply("Error: Invalid country. Please select a country using the command $setcountry (country abbreviation) (e.g 'US', 'UK', 'EU')\nA simple list can be found here: http://sustainablesources.com/resources/country-abbreviations/\nIf an invalid country is selected, it will default to the US");
								}
							}
						});
					} else{
						message.reply("Please Use This Command in The 'deals' channel or the 'gamedeals' channel");
					}
				} else{
					message.reply("Plase Do Not PM This Bot, It is for server use only");
				}		
			} else if(commandIs("country",message)){
				db.all('SELECT * FROM currency WHERE server = (?)',[message.guild.id],(err,row) =>{
					if(err || row.length === 0){
						message.reply("The server " + message.guild.name + " does not have a country assigned");
					}
					else{
						message.reply("The server `" + message.guild.name + "` has the country " + row[0].currency + " assigned to it");
					}
				});
			} else if(commandIs("getroles",message)){
				console.log(message.author);
			} else if(message.content.toLowerCase().startsWith("$")){
				message.reply("Please use a valid command. Use `$help` for more information");
			}
		} else if(message.content.toLowerCase().startsWith("$")){
			message.reply("Please Use This Command in The 'deals' channel or the 'gamedeals' channel");
		}	
	} else{
	message.reply("Plase Do Not PM This Bot, It is for server use only");
	}
});

	
function handleDeals(args,message){
	var game = args;
	fetch('https://api.isthereanydeal.com/v02/game/plain/?key=f55594bffb57447dba45e79505445dd5c2954286&title=' + game)
	.then(titleres => titleres.json())
	.then(function(titleres){
		game = titleres.data.plain;
		if(game){
			var currencychar = "";
			db.all('SELECT currency FROM currency WHERE server = (?)',[message.guild.id],(err,row) =>{
				if(err || row.length === 0){
					message.reply("Error: Please select a country (e.g 'USD', 'GBP', 'EUR') using the command $setcountry (currency)");
				} else{
					var country = row[0].currency;
					switch(country){
						case "GB":
							currencychar = "£";
							break;
						case "US": 
							currencychar = "$";
							break;
						case "AD":
						case "AT":
						case "BE":
						case "CY":
						case "EE":
						case "FI":
						case "FR":
						case "DE":
						case "GR":
						case "IE":
						case "IT":
						case "LV":
						case "LT":
						case "LU":
						case "MT":
						case "MC":
						case "ME":
						case "AN":
						case "PT":
						case "SM":
						case "SK":
						case "SI":
						case "ES":
						case "VA":
							currencychar = "€";
							break;
						default:
							currencychar = "";
							break;
					}
					fetch('https://api.isthereanydeal.com/v01/game/prices//?key=f55594bffb57447dba45e79505445dd5c2954286&plains='+ game +'&country=' + country) //Is the api fucked? try and fix it! Possible fix = change to region
					.then(res => res.json())
					.then(res=>{
					if(game !== false){
						var final = "";
						var amount
						if(res.data[game].list.length > 5){
							amount = 5
						}
						else{
							amount = res.data[game].list.length;
						}
						for(x = 0; x < amount; x++){
							if(res.data[game].list[x].price_cut !== 0){
								final += "\n Store: " + res.data[game].list[x].shop.name;
								final += "\n Old Price: " + currencychar + res.data[game].list[x].price_old;
								final += "\n New Price: " + currencychar + res.data[game].list[x].price_new;
								final += "\n -" + res.data[game].list[x].price_cut + "% Off";
								final += "\n Link: " + res.data[game].list[x].url + "\n";	
							} else if(x === 0){
								final = "\n No Deals Found";
								break;
							}
						}
						message.reply(final);
						var successDate = new Date();
						console.log("Successfully retrieved on" + successDate);	
						} else{
							message.reply("Game Not Found")
						}
					});
				}
			});
		} else{
			return false;
		}
	})
}

client.login('MzQ1NTExMjAwNDU0NjA2ODUw.DG8Wqw.8GuhCBZ0gY6kx_tgsFgCnBXYcN4');
