

![](https://tokei.rs/b1/github/JamTheBean/Deal-Master-Bot)
<img src="https://imgur.com/Kd069tt.png" height="200" />

# Deal Master Bot
> What is deal master bot?
 
The deal master bot is a discord bot to check for deals and notifiy selected users about bundles.

## Installing / Getting started
>How do I get the bot up and running?

To get the bot up and running you just need to click <a href="https://discordapp.com/oauth2/authorize?client_id=345511200454606850&scope=bot&permissions=268725320" target="_blank">here</a>

Then you select the server you wish to add the bot to and click Authorize, confirm you're not a bot and then it will be added to your server!

After this there are several commands that you should perform to setup the bot for your server.


## General Commands
>How do I use this thing!?!?!?!?

| Command | Description |Example
| --- | --- | ---|
|`$deal(s) [game name]`|Gets the best deals for the game you chose from legitimate sites|`$deals Grand Theft Auto 5`|
|`$country`|Checks the country that the server is assigned to|`$country`|
|`$subscribe / $sub`|Subscribes the user to notifications from the bot|`$subscribe`|
|`$unsubscribe / $unsub`|Unsubscribes the user from notifications|`$unsubscribe`|

## Setup / Admin Only Commands
>How do I setup this thing?!?!?!?

| Command | Description |Example
| --- | --- | ---|
| `$setcountry [country abbreviation]`|Sets what currency the server will be using (find them all <a href="http://sustainablesources.com/resources/country-abbreviations/" target="_blank">here</a>) |`$setcountry UK`|
|`$rolesubscribe / $rolesub / $subscriberole / $subrole [role]`|Sets the role to notify for both humble bundle and humble monthly updates, please note, do not `@` the role as that is currently not supported|`$rolesub Subscribers`|
|`$bundle(s) [on, check, off]`|Enables bundle notifications for the channel that this command is peformed in|`$bundles on`|
|`$monthly / $humblemonthly [on, check, off]`|Enables humble monthly notifications for the channel that this command is peformed in|`$monthly on`|
