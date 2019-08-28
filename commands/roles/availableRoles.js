module.exports = {
	name: ['availableroles', 'roles'],
	description: 'Lists all roles',
	args: false,
	execute(message, args) {

		let Role = require("../../models/role.model")
		Role.find({ server: message.guild.id })
			.then(roles => {
				let str = [`Available roles:`]
				roles.map(role => {
					const tmp = message.guild.roles.find(serverRole => serverRole.id === role.id )
					
					if(tmp){
						const rl = message.guild.roles.get(role.admin)
                        str.push(`${tmp.name} ${role.admin ? `(moderated by ${rl.name})`: ''}`)
                            
					}
				});
				str.push('', "Request role by:", "!requestrole <role>")
				message.channel.send(str.join("\n"), { code: true });
			})
			.catch((err) => {
				console.log(err.message)
				throw err
			})

		
		
	},
};