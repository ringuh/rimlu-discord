const database = require('../../funcs/database')

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
        let roleA = []
        let adminRole = null
        let channel = null
        for (let j in args) {
            channel = IsChannel(args[j], message.guild)
            if (channel) {
                let i = parseInt(j) + 1
                adminRole = message.guild.roles.find(role => role.name.toLowerCase() == args.slice(i).join(" ").toLowerCase())
                break
            } else
                roleA.push(args[j])
        }

        roleA = message.guild.roles.find(role => role.name.toLowerCase() == roleA.join(" ").toLowerCase())


        if (!roleA) {
            message.channel.send(`Role not found`, { code: true });
            return true
        }

        if (roleA.name.toLowerCase() !== args.join(" ").toLowerCase() && !(adminRole && channel)) {
            message.channel.send(`Invalid channel and admin role`, { code: true });
            return true
        }
        // "channel ja role tallessa. tallenna db"

        if (roleA) {
            let Role = require("../../models/role.model")

            Role.findOne({ server: message.guild.id, id: roleA.id })
                .then((role) => {
                    if (!role)
                        Role.create({
                            server: message.guild.id,
                            id: roleA.id,
                            admin: adminRole ? adminRole.id : null,
                            channel: channel ? channel.id : null
                        }).then(role => {
                            let str = `Enabling access to role ${roleA.name}`
                            if (channel && adminRole)
                                str += ` moderated by ${adminRole.name} at channel ${channel}`
                            message.channel.send(str, { code: false });
                        }).catch((err) => {
                            console.log(err.message)
                            throw err
                        })
                    else {
                        role.remove().then(() =>
                            message.channel.send(`Removing access to role ${roleA.name}.\nRun this command again if you wanted to edit the role access.`, { code: true })
                        )
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                    throw err
                })




            return true
        }

    },
};