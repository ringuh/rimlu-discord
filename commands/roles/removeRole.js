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

        if (!message.member.hasPermission("ADMINISTRATOR") && member.id != message.author.id) { 
            message.channel.send(`You don't have permission to do whatever you were doing`, { code: true });
            return true
        } 


        let role = message.member.roles.find(role => role.name.toLowerCase() == roleStr.toLowerCase())

        if (role) {
            member.removeRole(role.id)
            message.channel.send(`Removing role ${role.name} from ${member}`, { code: false });
            
        } else
            message.channel.send(`Role ${args[0]} not found`, { code: true });
    },
};