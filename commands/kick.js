module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them (but not really).',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}

		const taggedUser = message.mentions.users.first();

		message.channel.send(`Are you sure you want to kick: ${taggedUser.username}? (y)es/(n)o`);
			
			const args = message.content.split(/ +/);
			const command = args.shift().toLowerCase();
			if (command === 'y' || 'yes')
				message.guild.kick;
			else
				return message.reply('User is not being kicked');

	},
};