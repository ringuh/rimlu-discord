module.exports = {
	name: ['createchannel'],
	description: 'Creates channel',
	args: "<name> [role]",
	execute(message, args) {
		

		message.channel.send(`First argument: ${args[0]}`);
	},
};