const fs = require('fs');
const discord = require('discord.js');
const { prefix, token } = require('./config.json');

const bot = new discord.Client();
bot.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
}

bot.on('ready', () => {
    console.log('Ready!');
});

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    else if (message.content.startsWith(prefix))
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

bot.login(token);