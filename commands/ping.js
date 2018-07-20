
module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        message.channel.send('Pinging...').then(msg => {
            msg.edit(`Response took: \`(${msg.createdTimestamp - message.createdTimestamp}ms)\``);
      });
    },
};