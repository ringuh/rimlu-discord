

module.exports = {
    name: ['managerole', 'mr'],
    description: 'Toggles role requests: !managerole pikku mulli #pikku-mullit bot',
    args: "<role> [channel] [adminrole]",
    execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Admin access required`, { code: true })
            return true
        }
        if (args.length < 1) {
            message.channel.send(`Usage: ${this.name[0]} ${this.args}`, { code: true })
            return true
        }
        const { IsChannel } = require('../../funcs/mentions.js')
        let targetRole = []
        let adminRole = null
        let channel = null
        for (let j in args) {
            channel = IsChannel(args[j], message.guild)
            if (channel) {
                let i = parseInt(j) + 1
                adminRole = message.guild.roles.find(role => role.name.toLowerCase() == args.slice(i).join(" ").toLowerCase())
                break
            } else
                targetRole.push(args[j])
        }

        targetRole = message.guild.roles.find(role => role.name.toLowerCase() == targetRole.join(" ").toLowerCase())


        if (!targetRole) {
            message.channel.send(`Role not found`, { code: true });
            return true
        }

        if (targetRole.name.toLowerCase() !== args.join(" ").toLowerCase() && !(adminRole && channel)) {
            message.channel.send(`Invalid channel and admin role`, { code: true });
            return true
        }
 

        if (targetRole) {
            const { Role } = require("../../models")

            Role.findOrCreate({
                where: { server: message.guild.id, role: targetRole.id },
                defaults: {
                    admin: adminRole ? adminRole.id : null,
                    channel: channel ? channel.id : null
                }
            }).then(([role, created]) => {
                if (created) {
                    let str = `Enabling access to role ${targetRole.name}`
                    if (channel && adminRole)
                        str += ` moderated by ${adminRole.name} at channel ${channel}`
                    message.channel.send(str, { code: false });
                }
                else{
                    role.destroy().then(() => {
                        message.channel.send(`Removing access to role ${targetRole.name}.\nRun this command again if you wanted to edit the role access.`, { code: true })
                    })
                }
            }).catch((err) => {
                console.log(err.message)
                throw err
            })
            return true
        }

    },
};