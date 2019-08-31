

module.exports = {
    name: ['addstream', 'as'],
    description: 'Adds stream',
    args: "<platform> [channel] <stream1 ... streamN>",
    async execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Admin access required`, { code: true })
            return true
        }
        if (args.length < 2) {
            message.channel.send(`Usage: ${this.args}`, { code: true })
            return true
        }

        const platforms = ["twitch", /* "youtube" */]
        const platform = args[0].toLowerCase()
        args.shift()

        if (!platforms.includes(platform))
            return message.channel.send(`Unknown platform: ${platform}\nAvailable: ${platforms.join(" / ")}`, { code: true });

        const { IsChannel } = require('../../funcs/mentions.js')
        const setting = require('../setting')

        let channel = null
        for (let j in args) {
            channel = IsChannel(args[j], message.guild)
            if (channel) {
                args.splice(j, 1)
                break
            }

        }

        /* if(!channel)
            channel = await setting.get(message.guild, 'stream_channel')
        
        if(!channel)
            return message.channel.send(`No stream_channel found`) 

        channel = channel.value || channel */
        
        
        
        const { Stream } = require("../../models")

        let replyStr = [`Adding streams to ${platform}:`]

        let promises = args.map(account => new Promise(resolve => {
            Stream.findOrCreate({
                where: { server: message.guild.id, 
                    account: account, 
                    platform: platform },
                defaults: { channel: channel ? channel.id: null }
            }).then(([stream, created]) => {
                if (created)
                    replyStr.push(`++${stream.account}`)
                else
                    replyStr.push(`= ${stream.account}`)

            }).catch((err) => {
                console.log(err.message)
                throw err

            }).finally(() => resolve())
        }))


        Promise.all(promises).then(() => message.channel.send(replyStr.join("\n"), { code: true }))


    },
};