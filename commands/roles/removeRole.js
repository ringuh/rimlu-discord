module.exports = {
    name: ['removerole'],
    description: 'Removes role from user: !removerole @pienirexuli#1337 pikku mulli',
    args: "[user] <role>",
    execute(message, args) {
        if (args.length < 1) {
            message.channel.send(`Usage: ${this.name[0]} ${this.args}`, { code: true })
            return true
        }

        let roleStr = args.join(" ")
        const { IsUser } = require('../../funcs/mentions.js')
        let member = message.member
        if (args.length > 1) {
            member = IsUser(args[0], message.guild)
            if (member) {
                args.shift()
                roleStr = args.join(" ")
            } else {
                member = message.member
            }
        }

        const role = message.guild.roles.find(role => role.name.toLowerCase() == roleStr.toLowerCase())
        if (!role || !member.roles.get(role.id)) {
            message.channel.send(`Role ${roleStr} not found`, { code: true });
            return true
        }

        
        Role = require('../../models/role.model')
        Role.findOne({ server: message.guild.id, id: role.id })
            .then(rooli => {
                const adminaccess = message.member.roles.get(rooli.admin) || message.member.hasPermission("ADMINISTRATOR")

                if (!adminaccess && member.id != message.author.id) {
                    message.channel.send(`You don't have permission to do whatever you were doing`, { code: true });
                    return true
                }

                if (role) {
                    member.removeRole(role.id).then(() =>
                        message.channel.send(`Removing role ${role.name} from ${member}`, { code: false }))

                        let Requestedrole = require("../../models/requestedrole.model")
                        if(member.id == message.author.id)
                            Requestedrole.findOneAndDelete({ server: message.guild.id, role: role.id, user: member.user.id }).then(()=> console.log("deleting"))

                } else
                    message.channel.send(`Role ${args[0]} not found`, { code: true });
            })
    },
};