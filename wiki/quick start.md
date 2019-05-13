# Deal Master Bot quick start guide

Discord bots can be tricky to set up sometimes. I've spent countless hours going through command lists and settings to attempt to figure out how to **begin** setting up a bot. Trying to find what commands are needed, trying to find settings to change and what I can enable, or just trying to figure out what permissions the bot needs (or what permissions I need for some commands). Keeping all of the struggle I have had setting up bots in mind, I (Blankz_) will attempt to make a guide that goes over how to add Deal Master Bot to your server, what commands you **need** to activate, and some commands that **may** interest you. Hopefully I will be able to do that and not lose you on the way, but if you do get lost, feel free to PM me or Jam (developer) on discord and we can help you out! Tags at the bottom.

## Adding Deal Master Bot to your discord server

First, make sure you have the "Manage Server" permission on the server. 
To check this:

 1. Go to the server
 2. Click the server's name in the top left
 3. In the drop-down menu that appears, look for "Server Settings"
  
![Example of "Server Settings"](https://i.imgur.com/qIwnCtE.png)
  
  If it shows up: 
  You have the correct permissions, you **can** invite the bot.
  
  If it **does not** show up:
  You **can not** invite the bot. If you want the bot on said server you will need to contact the owner or an admin and ask them to add it.


----------

Since you are still reading I am assuming you have the permissions to invite the bot to your server, so lets get on with it shall we? 

To invite the bot to your server you have to click [**this link**](https://discordapp.com/oauth2/authorize?client_id=345511200454606850&scope=bot&permissions=268528712)

This will lead you to a page showing the bot name, a box asking which server you wish to add the bot to (along with every server you have the permission to add the bot to), and a menu with permissions for the bot.
![Bot Invite Window](https://i.imgur.com/nnA3BVN.png)

All you need to do here is click the drop down menu, select your server, and click authorize.
The bot should now show up in your server.

----------
## Setting a country (Required)

You **need** to set a country for the bot to display deals in the correct currency.

You can set your country by typing `$setcountry [country abbreviation]`in chat. 
For a list of country abbreviations, click [**this link**](http://sustainablesources.com/resources/country-abbreviations/)

**Note: If your country is not supported, give Jam a pm and he will implement it.**

![Showing The Set Country Command](https://i.imgur.com/NWqMoMd.png)

## Setting up bundle / monthly notifications (optional)

These commands will set up the bot's automatic Humble Bundle and Humble Monthly announcements.

Since this is optional, feel free to skip this step if it doesn't interest you.

![Showing The Bundle Notifications In Action](https://i.imgur.com/Fhs0beA.png)

Pick or make a channel for bundle notifications.

Type these two commands **in the channel you wish to have the automatic messages be sent in:**

 1. `$bundles on` This command makes it so whenever Deal Master Bot detects a new bundle is out. He will post a link to it **in the channel you type this command in**
 
![Showing Bundles Command](https://i.imgur.com/H8PdjZ2.png)
 
 2. `$monthly on` This command toggles reminders for the humble monthly. The bot will post a reminder every first Friday of each month to remind people that the new Humble Monthly is out. **He will post this message in the channel you type the command in**
 
![Showing The Monthly Command](https://i.imgur.com/dUKLBhZ.png)

The bot will automatically send the messages **in the channel you put the commands in.**

## setting up a subscription role (optional)

This role will be mentioned whenever a new bundle is out.
 1. Make or pick a role to be mentioned ( I recommend a @Subscribers role)
 2. Make sure the bot's role is **Higher** than the subscription role in the role list
 3. Type `$rolesub [role name]` 
 
 **Note: Do not mention the role, just type the role name. The bot will not find the role if you mention it.**
 This is a bug, Jam knows about it and is working on it as we speak.
 
![Showing RoleSub Command](https://i.imgur.com/AZFyMIL.png)
 
 4. Type `$sub` to have the role added to you

![Sub Command Demonstration](https://thumbs.gfycat.com/LiquidEuphoricJackrabbit-size_restricted.gif) 

## Extended Commands List

Check out [**this link**](https://github.com/jamiegyoung/deal-master-bot/blob/master/wiki/commands.md) for a full list of commands!

## That's all, folks!

Hopefully this guide helped you guys out a bit! Feel free to pm me on discord with any feedback as this was the first guide I've written.
____

**Guide writer:** Hapax#8903 (aka Blankz_)

**Developer:** Jam#0001



