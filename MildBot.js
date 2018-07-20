const fs = require('fs');
var Cleverbot = require("cleverbot-node");
const Music = require('discord.js-musicbot-addon');
const discord = require('discord.js');
const { prefix, token, ytKey, clKey } = require('./config.json');

clbot = new Cleverbot;
const MildBot = new discord.Client();
MildBot.commands = new discord.Collection();
const cooldowns = new discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    MildBot.commands.set(command.name, command);
}


MildBot.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

/////////////////////////////////////////
////////////General Commands/////////////
/////////////////////////////////////////

MildBot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!MildBot.commands.has(commandName)) return;

    const command = MildBot.commands.get(commandName);

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;
    
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } 
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

/////////////////////////////////////////
//////////////Music Commands/////////////
/////////////////////////////////////////

Music.start(MildBot, {
    youtubeKey: ytKey,       //youtube key
    prefix: prefix,          // Prefix for the commands.
    global: false,           // Non-server-specific queues.
    maxQueueSize: 25,        // Maximum queue size of 25.
    clearInvoker: true,      // If permissions applicable, allow the bot to delete the messages that invoke it.
    helpCmd: 'mhelp',        // Sets the name for the help command.
    playCmd: 'play',         // Sets the name for the 'play' command.
    volumeCmd: 'adjust',     // Sets the name for the 'volume' command.
    leaveCmd: 'begone',      // Sets the name for the 'leave' command.
    disableLoop: true,       // Disable the loop command.
    enableQueueStat: true    // Olaying Paused indicator.
  });

/////////////////////////////////////////
//////////////CleverBot /////////////////
/////////////////////////////////////////

  MildBot.on("message", message => {
    if (message.channel.type === "dm") {
        if (message.author.bot) return;

        clbot.write(message.content, (response) => {
        message.channel.startTyping();
        setTimeout(() => {
          message.channel.send(response.output).catch(console.error);
          message.channel.stopTyping();
        }, Math.random() * (1 - 3) + 1 * 1000);
      });
    }
    else    {
        if (!message.content.startsWith(prefix+' ') || message.author.bot) return;
        
        clbot.write(message.content, (response) => {
            message.channel.startTyping();
            setTimeout(() => {
              message.channel.send(response.output).catch(console.error);
              message.channel.stopTyping();
            }, Math.random() * (1 - 3) + 1 * 1000);
          });
    }
  });

clbot.configure({botapi: clKey});
MildBot.login(token);