Since some discord bots can have lists upon lists of commands to fully set them up and sometimes the required commands aren't always obvious, I have decided to write a quick start guide for all of you that haven't used many discord bots or just don't have the time to look through the commands.

## Adding Deal Master Bot to your discord server
First, Make sure you have the "Manage Server" permission on the server. 
To check this:

 1. Go to the server
 2. Click the server's name in the top left
 3. In the drop-down menu that appears, look for "Server Settings"
  
![Example of "Server Settings"](https://i.imgur.com/qIwnCtE.png)
  
  If it shows up: 
  You have the correct permissions, you **can** invite the bot.
  
  If it does not show up:
  You **can not** invite the bot. if you want the bot on said server please contact the owner or an admin and suggest it to them.


----------

Since you are still reading i am assuming you have the permissions to invite the bot to your server, so lets get on with it shall we? 

To invite the bot to your server you have to click [This link](https://discordapp.com/oauth2/authorize?client_id=345511200454606850&scope=bot&permissions=268725320)

This will lead you to a page showing the bot name, a box asking which server you wish to add he bot to (along with every server you have the permission to add the bot to), and a menu with permissions for the bot.
![Bot Invite Window](https://i.imgur.com/nnA3BVN.png)

All you need to do here is click the drop down menu, select your server, and click authorize.
The bot should now show up in your server.

----------
## Setting a currency (Required)
you can add a default currency by typing `$setcountry [country abbreviation]`in chat. For a list of country abbreviations click [this link](http://sustainablesources.com/resources/country-abbreviations/)

![Showing The Set Country Command](https://i.imgur.com/NWqMoMd.png)

## Setting up Bundle / Monthly Notifications
Pick a channel (or make a channel) for bundle notifications **If you want them**,
Got a channel in your head? good.
Type these two commands **in the channel you wish to have the automatic messages be sent in:**

 1. `$bundles on` This command makes it so whenever Deal Master Bot detects a new bundle is out , he will post a link to it in your server.
 
![Showing Bundles Command](https://i.imgur.com/H8PdjZ2.png)
 
 2. `$monthly on` This command toggles reminders for the humble monthly. 
 
![enter image description here](https://i.imgur.com/dUKLBhZ.png)

The bot will automatically send the messages in the channel you put the commands in.
## setting up a subscription role
This role will be mentioned whenever a new bundle is out.
 1. Make or pick a role to be mentioned ( i recommend an @Subscribers role)
 2. type `$rolesub [role name]` 
 
![enter image description here](https://i.imgur.com/AZFyMIL.png)
 
 3. type `$sub` to have the role added to you

![enter image description here](https://thumbs.gfycat.com/LiquidEuphoricJackrabbit-size_restricted.gif)

**Note: for the role name do not type "@Subscribers", type "Subscribers" instead.** 

## That's all, folks!
Check out Commands for a full list of commands!
