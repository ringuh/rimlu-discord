module.exports = {
	name: ['liststreams', 'streams'],
	description: 'Lists all streams',
	args: false,
	execute(message, args) {

		const { Stream } = require("../../models")
        Stream.findAll({ where: { server: message.guild.id }, order: 
            [["platform"], ["account"]] })
			.then(roles => {
				let str = [`Available streams:`]
				roles.forEach(el => {
                    str.push(`${el.account} / ${el.platform} -- seen: ${el.updatedAt.toString() !== el.createdAt.toString() ? el.updatedAt.toLocaleString('en-GB', { timeZone: 'UTC' }): 'never'}`)
                });
				str.push("", `total: ${roles.length}` )
				message.channel.send(str.join("\n"), { code: true });
			})
			.catch((err) => {
				console.log(err.message)
				throw err
			})



	},
};