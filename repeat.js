const Discord = require('discord.js');
const { repeat_token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Repeat bot running!');
	client.user.setActivity("!repeat", {type: "LISTENING"});
});

client.on('message', message => {
    const command = "!repeat"
	if (!message.content.startsWith(command) || message.author.bot || !message.member.hasPermission("ADMINISTRATOR")) return;
    const str = message.content.slice(command.length).trim()
    
	try {
		message.channel.send(str)
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(repeat_token);


