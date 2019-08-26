module.exports = {
	name: ['availableroles', 'roles'],
	description: 'Lists all roles',
	args: false,
	execute(message, args) {
		
        message.guild.roles.map(role => console.log(role.name))
		message.channel.send(`First argument: ${args[0]}`);
	},
};