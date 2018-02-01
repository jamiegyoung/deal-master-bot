Discord bots can be tricky to set up sometimes. I've spent countless hours going through command lists and settings to attempt to figure out how to **begin** setting up a bot. Trying to find what commands are needed, trying to find settings to change and what i can enable, or just trying to figure out what permissions the bot needs (or what permissions i need for some commands). Keeping all of the struggle i have had setting up bots in mind, I (Blankz_) will attempt to make a guide that goes over how to add Deal Master Bot to your server, What commands you **need** to activate, and some commands that **may** interest you. Hopefully i will be able to do that and not lose you on the way, but, if you do get lost feel free to pm me or Jam (Programmer) on discord and we can help you out! Tags at the bottom.

## Adding Deal Master Bot to your discord server
First, Make sure you have the "Manage Server" permission on the server. 
To check this:

 1. Go to the server
 2. Click the server's name in the top left
 3. In the drop-down menu that appears, look for "Server Settings"
  
![Example of "Server Settings"](https://i.imgur.com/qIwnCtE.png)
  
  If it shows up: 
  You have the correct permissions, you **can** invite the bot.
  
  If it **does not** show up:
  You **can not** invite the bot. if you want the bot on said server please contact the owner or an admin and suggest it to them.


----------

Since you are still reading i am assuming you have the permissions to invite the bot to your server, so lets get on with it shall we? 

To invite the bot to your server you have to click [This link](https://discordapp.com/oauth2/authorize?client_id=345511200454606850&scope=bot&permissions=268725320)

This will lead you to a page showing the bot name, a box asking which server you wish to add he bot to (along with every server you have the permission to add the bot to), and a menu with permissions for the bot.
![Bot Invite Window](https://i.imgur.com/nnA3BVN.png)

All you need to do here is click the drop down menu, select your server, and click authorize.
The bot should now show up in your server.

----------
## Setting a country (Required)
You need to set a country for the bot to know what type of currency to give you.

You can set your country by typing `$setcountry [country abbreviation]`in chat. 
For a list of country abbreviations, click [this link](http://sustainablesources.com/resources/country-abbreviations/)

![Showing The Set Country Command](https://i.imgur.com/NWqMoMd.png)

## Setting up Bundle / Monthly Notifications
These commands will set up the bot's automatic Humble Bundle and Humble Monthly announcements.

![Showing The Bundle Notifications In Action](https://i.imgur.com/Fhs0beA.png)

Pick a channel (or make a channel) for bundle notifications **If you want them**,
Got a channel in your head? good.
Type these two commands **in the channel you wish to have the automatic messages be sent in:**

 1. `$bundles on` This command makes it so whenever Deal Master Bot detects a new bundle is out , he will post a link to it **in the channel you type this command in**
 
![Showing Bundles Command](https://i.imgur.com/H8PdjZ2.png)
 
 2. `$monthly on` This command toggles reminders for the humble monthly. The bot will post a reminder every first friday of the month to remind people to pick up their humble monthly, **he will post this message in the channel you type the command in**
 
![enter image description here](https://i.imgur.com/dUKLBhZ.png)

The bot will automatically send the messages in the channel you put the commands in.
## setting up a subscription role
This role will be mentioned whenever a new bundle is out.
 1. Make or pick a role to be mentioned ( i recommend a @Subscribers role)
 2. type `$rolesub [role name]` 
 
 **Note: Do not mention the role, just type the role name. The bot will not find the role if you mention it.**
 This a bug, it has been reported and Jam is working on it.
 
![Showing RoleSub Command](https://i.imgur.com/AZFyMIL.png)
 
 3. type `$sub` to have the role added to you

![Sub Command Demonstration](https://thumbs.gfycat.com/LiquidEuphoricJackrabbit-size_restricted.gif) 

## Extended Commands List
Check out [**insert link**] for a full list of commands!

## That's all, folks!
I hope this guide helped you set up the bot of your dreams.... and your wallets nightmares.
____

Guide writer: Hapax#8903 (aka Blankz_)

Programmer: Jam#0001 (aka a guy who bought discord nitro for that sweet #, oh and he also made the bot... /shrug)



