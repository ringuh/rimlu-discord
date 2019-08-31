
const { Setting } = require('../models')
const { IsMention, IsUser, IsChannel } = require('../funcs/mentions')

module.exports = {
    name: ['setting'],
    description: 'Set a server setting',
    args: "<setting> <value>",

    async execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Admin access required`, { code: true })
            return true
        }
        if (args.length < 1) {
            message.channel.send(`Usage: ${this.description}`, { code: true })
            return true
        }
        const setting = args[0].toLowerCase()

        if (args.length < 2) {
            return this.get(message.guild, setting, message)
        }

        const value = args[1]
        this.save(message, setting, args[1])


    },

    async save(message, key, val) {
        
        let [value, type] = IsMention(val, message.guild)
        
        await Setting.findOrCreate({
            where: { server: message.guild.id, key: key },
            defaults: { value: value.id || value, type: type }
        }).then(([setting, created]) => {
            if (!type && value.toLowerCase() === "delete")
                setting.destroy().then(() => message.channel.send(`Deleted ${key}`))

            else {
                message.channel.send(`Saved ${key} as ${value}`)
            }

        }).catch((err) => {
            console.log(err.message)
            throw err
        })
    },

    get(server, key, message) {
        return Setting.findOne({
            where: { server: server.id, key: key }
        }).then((val) => {
            if (val && val.type === "discord_user")
                val.value = IsUser(val.value, server)
            else if (val && val.type === "discord_channel")
                val.value = IsChannel(val.value, server)

            if (message)
                val ? message.channel.send(`setting '${val.key}' is ${val.value}`) : message.channel.send(`setting '${key}' not found`)
            return val
        })
    },
};