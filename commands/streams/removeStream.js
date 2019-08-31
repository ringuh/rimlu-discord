

module.exports = {
    name: ['removestream', 'rs'],
    description: 'Remove stream',
    args: "<platform> <channel1 ... channelN>",
    async execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Admin access required`, { code: true })
            return true
        }
        if (args.length < 2) {
            message.channel.send(`Usage: ${this.description}`, { code: true })
            return true
        }
     

        const platforms = ["twitch", "youtube"]
        const platform = args[0].toLowerCase()
        args.shift()

        if (!platforms.includes(platform))
            return message.channel.send(`Unknown platform: ${platform}\nAvailable: ${platforms.join(" / ")}`, { code: true });

        const { Stream } = require("../../models")

        let replyStr = [`Removing streams to ${platform}:`]

        let promises = args.map(account => new Promise(resolve => {
            Stream.findOne({
                where: { server: message.guild.id, account: account, platform: platform }
            }).then((tbd) => {
                if (tbd){
                    replyStr.push(`--${tbd.account}`)
                    tbd.destroy()
                }
                    
                else
                    replyStr.push(`? ${account}`)
                    

            }).catch((err) => {
                console.log(err.message)
                throw err

            }).finally(() => resolve())
        }))


        Promise.all(promises).then(() => message.channel.send(replyStr.join("\n"), { code: true }))


    },
};