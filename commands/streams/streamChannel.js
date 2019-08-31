

module.exports = {
    name: ['streamchannel'],
    description: 'Sets default announce channel',
    args: "<channel>",
    async execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Admin access required`, { code: true })
            return true
        }
        if (args.length < 1) {
            message.channel.send(`Usage: ${this.description}`, { code: true })
            return true
        }


        const { IsChannel } = require('../../funcs/mentions.js')

        let channel = IsChannel(args[0], message.guild)
        
        if (!channel) return message.channel.send(`Channel ${args[0]} not found`)
        
        const setting = require('../setting')

        setting.save(message, 'stream_channel', channel.id)








    },
};