const { botPermission } = require('../funcs/commandTools')
const { prefix } = global.config
module.exports = {
    name: ['commands', 'list', 'cmd', 'cmds', 'command'],
    description: 'Lists available commands',
    args: false,
    execute(message, args) {
        path = require('path')
        var reply = [`Available ${global.config.prefix}${this.name[0]}:`]
        const dirs = (fPath) => {
            var replies = []
            const folders = require('fs').readdirSync(fPath, { withFileTypes: true }).filter(file => file.isDirectory() && file.name !== 'hidden');
            const commandFiles = require('fs').readdirSync(fPath, { withFileTypes: true }).filter(file => file.name.endsWith('.js'));

            for (const file of commandFiles) {
                const cmd = require(path.join(fPath, file.name));
                if (!cmd.hidden && botPermission(message, cmd.permissions, false))
                    replies.push(`${cmd.name.join(" / ")} ${cmd.args ? cmd.args + " --" : '--'} ${cmd.description}`)
            }

            folders.forEach(folder => {
                let r = dirs(require('path').join(fPath, folder.name))
                if (r.length)
                    replies = [...replies, "", folder.name, "-------", ...r]
            })
            return replies
        };

        reply = [...reply, ...dirs(__dirname)]

        message.channel.send(reply.join("\n"), { code: true })

    },
};