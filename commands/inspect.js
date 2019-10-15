

module.exports = {
    name: ['inspect'],
    description: 'Inspects role/user/channel accesses',
    args: "<role/user/channel/'server'>",
    execute(message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Admin access required`, { code: true })
            return true
        }
        if (args.length < 1) {
            message.channel.send(`Usage: ${this.name[0]} ${this.args}`, { code: true })
            return true
        }
        const arg = args.join(" ")
        const { IsChannel, IsUser } = require('../funcs/mentions.js')
        const guild = message.guild
        const user = IsUser(arg, guild)
        const channel = IsChannel(arg, guild)
        const role = guild.roles.find(role => role.name.toLowerCase() == arg.toLowerCase())



        const permissionList = [
            "ADMINISTRATOR",
            "CREATE_INSTANT_INVITE",
            "KICK_MEMBERS",
            "BAN_MEMBERS",
            "MANAGE_CHANNELS",
            //"MANAGE_GUILD",
            //"ADD_REACTIONS",
            //"VIEW_AUDIT_LOG",
            "PRIORITY_SPEAKER",
            "VIEW_CHANNEL",
            "READ_MESSAGES",
            "SEND_MESSAGES",
            //"SEND_TTS_MESSAGES",
            "MANAGE_MESSAGES",
            //"EMBED_LINKS",
            //"ATTACH_FILES",
            "READ_MESSAGE_HISTORY",
            "MENTION_EVERYONE",
            /* "USE_EXTERNAL_EMOJIS",
            "EXTERNAL_EMOJIS",
            "CONNECT", */
            "SPEAK",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MOVE_MEMBERS",
            /* "USE_VAD", */
            /* "CHANGE_NICKNAME",
            "MANAGE_NICKNAMES", */
            /* "MANAGE_ROLES",
            "MANAGE_ROLES_OR_PERMISSIONS",
            "MANAGE_WEBHOOKS",
            "MANAGE_EMOJIS" */,]

        if (arg === "server") {
            let roles = guild.roles.map(role => {


                const r = {
                    name: role.name,
                    permissions: permissionList.filter(p => role.hasPermission(p)),
                    color: role.color,
                    position: role.calculatedPosition,
                    mentionable: role.mentionable,
                    managed: role.managed || role.hasPermission('ADMINISTRATOR'),
                }

                return r
            }).filter(role => !role.managed)
                .sort((a, b) => (a.position > b.position) ? 1 : -1)

            let str = [`Roles of ${guild.name}\n`]
            roles.forEach(r => {

                let rivi = [
                    `Role: ${r.name}`,
                    `permissions: ${r.permissions.join(" / ")}`,
                ]
                str.push(rivi.join("\n"))
            })

            message.channel.send(str.join("\n\n"), { code: true })
        }


        if (channel) {
            let str = [`Channel #${channel.name}`, '']



            guild.roles.map(r => {
                return {
                    name: r.name,
                    view: channel.permissionsFor(r).has("VIEW_CHANNEL"),
                    admin: channel.permissionsFor(r).has("ADMINISTRATOR"),
                    send: channel.permissionsFor(r).has("SEND_MESSAGES"),
                }
            }).filter(r => !r.admin)
                .sort((a, b) => (a.calculatedPosition > b.calculatedPosition) ? 1 : -1)
                .map(r => {
                    
                    let s = r.name;
                    if (r.view) s = `${s} ${r.send ? '' : '(read-only)'}`
                    else s = `${s} (BANNED)`

                    str.push(s)
                    return true
                })


            return message.channel.send(str.join("\n"), { code: true })
        }


        if (user) {
            const allChannels = user.guild.channels.filter(c => user.permissionsIn(c).has('VIEW_CHANNEL'))
                .sort((a, b) => (a.calculatedPosition > b.calculatedPosition) ? 1 : -1)

            const LoopChannels = (c, depth = 0) => {
                let children = allChannels.filter(c2 => c2.parentID === c.id)
                let perm = user.permissionsIn(c).has('SEND_MESSAGES') ? '' : '(read-only)'

                let tmpArr = [
                    `${depth === 0 ? '\n' : ''}` +
                    `${'\t'.repeat(depth)}` +
                    `${c.type === 'text' ? '#' : ''}${c.name}` +
                    ` ${perm}`,
                    ...children.map(c2 => LoopChannels(c2, depth + 1))]


                return tmpArr.join("\n")
            }
            let str = [`Inspecting ${user.user.username}`, '']
            str.push(`roles: ${user.roles.map(r => r.name).join(" / ")}`)

            let tmp = allChannels.filter(c => !c.parentID).map(c => LoopChannels(c))
            str.push(tmp.join("\n"))

            return message.channel.send(str.join("\n"), { code: true })
        }

        if (role) {
            if (role.hasPermission("ADMINISTRATOR"))
                return message.channel.send(`${role.name} is admin and all powerful`, { code: true })
            const allChannels = guild.channels.sort((a, b) => (a.calculatedPosition > b.calculatedPosition) ? 1 : -1)

            const LoopChannels = (c, depth = 0) => {
                let children = allChannels.filter(c2 => c2.parentID === c.id)
                let perm = c.permissionsFor(role).has('VIEW_CHANNEL') ?
                    (c.permissionsFor(role).has('SEND_MESSAGES') ? '' : '(read-only)') : '(BANNED)'


                let tmpArr = [
                    `${depth === 0 ? '\n' : ''}` +
                    `${'\t'.repeat(depth)}` +
                    `${c.type === 'text' ? '#' : ''}${c.name}` +
                    ` ${perm}`,
                    ...children.map(c2 => LoopChannels(c2, depth + 1))]


                return tmpArr.join("\n")
            }
            let str = [`Inspecting role ${role.name}`, '']

            let tmp = allChannels.filter(c => !c.parentID).map(c => LoopChannels(c))
            str.push(tmp.join("\n"))

            return message.channel.send(str.join("\n"), { code: true })
        }





    },
};