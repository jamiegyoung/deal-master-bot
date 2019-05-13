# Deal Master Bot 2 Soon<sup>TM<sup>
I vow to fix this absolute mess of a project sometime this summer

![](https://tokei.rs/b1/github/JamTheBean/Deal-Master-Bot)

<img src="https://imgur.com/Kd069tt.png" height="200" />

# Deal Master Bot
> What is deal master bot?
 
The deal master bot is a discord bot to check for deals and notifiy selected users about bundles.

## Installing / Getting started
>How do I get the bot up and running?

[**Here is a guide on how to get the bot setup!**](https://github.com/jamiegyoung/deal-master-bot/blob/master/wiki/quick%20start.md)

Then you select the server you wish to add the bot to and click Authorize, confirm you're not a bot and then it will be added to your server!

After this there are several commands that you should perform to setup the bot for your server found on the <a href="https://github.com/jamiegyoung/deal-master-bot/blob/master/wiki/commands.md" target="_blank">wiki</a>.
=======
After this there are several commands that you should perform to setup the bot for your server.


## General Commands
>How do I use this thing?

| Command | Description |Example
| --- | --- | ---|
|`$deal(s) [game name]`|Gets the best deals for the game you chose from legitimate sites|`$deals Grand Theft Auto 5`|
|`$country`|Checks the country that the server is assigned to|`$country`|
|`$subscribe / $sub`|Subscribes the user to notifications from the bot|`$subscribe`|
|`$unsubscribe / $unsub`|Unsubscribes the user from notifications|`$unsubscribe`|

## Setup / Admin Only Commands
>How do I setup this thing?

| Command | Description |Example
| --- | --- | ---|
| `$setcountry [country abbreviation]`|Sets what currency the server will be using (find them all <a href="http://sustainablesources.com/resources/country-abbreviations/" target="_blank">here</a>) |`$setcountry UK`|
|`$rolesubscribe / $rolesub / $subscriberole / $subrole [role]`|Sets the role to notify for both humble bundle and humble monthly updates, please note, do not `@` the role as that is currently not supported|`$rolesub Subscribers`|
|`$bundle(s) [on, check, off]`|Enables bundle notifications for the channel that this command is peformed in|`$bundles on`|
|`$monthly / $humblemonthly [on, check, off]`|Enables humble monthly notifications for the channel that this command is peformed in|`$monthly on`|
|`$chrono [on, check, off]`|Enables Chrono.gg Daily notifications for the channel that this command is peformed in|`$chrono on`|
