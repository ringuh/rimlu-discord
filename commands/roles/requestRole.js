module.exports = {
    name: ['requestrole'],
    description: 'Requests a role to user',
    args: "[user] <role>",
    async execute(message, args) {
        if (args.length < 1) {
            message.channel.send(`Usage: ${this.name[0]} ${this.args}`, { code: true })
            return true
        }

        jsontofile = require('../../funcs/jsontofile')

        let roleStr = args.join(" ")
        const { IsUser } = require('../../funcs/mentions')
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

        let role = message.guild.roles.find(role => role.name.toLowerCase() == roleStr.toLowerCase())
        if (!role) {
            message.channel.send(`Role '${args[0]}' not found`, { code: true });
            return true
        }

        if (role.hasPermission("ADMINISTRATOR")) {
            message.channel.send(`Managing admin roles is forbidden`, { code: true });
            return true
        }

        const { Request, Role } = require("../../models")

        const existing = await Request.findOne({
            where: { server: message.guild.id, role: role.id, user: member.id }
        })

        if (message.author.id == member.user.id && existing) {
            message.reply(`You have already requested role '${role.name}' and are prevented from doing it again`);
            return true
        }

        if (member.roles.get(role.id)) {
            message.channel.send(`${member} already has role '${role.name}'`, { code: false });
            return true
        }

        await Request.create({
            server: message.guild.id,
            user: member.id,
            role: role.id
        });


        Role.findOne({ where: { server: message.guild.id, role: role.id } })
            .then(roleReq => {
                if (!roleReq) {
                    message.channel.send(`Role '${role.name}' is not available`, { code: true });
                    return true
                }


                if (!roleReq.admin) {
                    member.addRole(role.id).then(() => {
                        message.channel.send(`Added role '${role.name}' to ${member}`, { code: false });
                    }).catch(err => message.channel.send(err, { code: true }))

                }

                else {
                    const Discord = require('discord.js');
                    const emb = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Promote ${member.user.username} as ${role.name}`)
                        .addField(`🆗 Accept`, "\u200B", false)
                        .addField(`🚷 Refuse`, "\u200B", false)
                        .setTimestamp()
                        .setFooter(`expires`);

                    message.reply(`request for role '${role.name}' sent. Wait for admins approval`, { code: false });
                    channel = message.guild.channels.get(roleReq.channel)
                    channel.send(emb).then(async function (msg) {
                        await msg.react("🆗")
                        await msg.react("🚷")

                        const filter = (reaction, user) => {
                            if (user.id == msg.author.id) return false
                            const member = msg.guild.members.find(mb => mb.id == user.id)
                            return ['🆗', '🚷'].includes(reaction.emoji.name) && (
                                member.hasPermission("ADMINISTRATOR") ||
                                member.roles.get(roleReq.admin)
                            )
                        };

                        msg.awaitReactions(filter, { max: 1, time: 24 * 60 * 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '🆗') {
                                    member.addRole(role.id)
                                    msg.channel.send(`${member} promoted to '${role.name}' by ${reaction.users.last()}`)
                                    msg.delete()
                                    //message.delete()

                                } else if (reaction.emoji.name === '🚷') {
                                    msg.channel.send(`${member} request declined by ${reaction.users.last()}`)
                                    message.reply(`request for role '${role.name}' declined`, { code: false });
                                    msg.delete()
                                    //message.delete()
                                }
                            })
                            .catch(collected => {
                                msg.delete()
                                //message.delete()
                            });




                    })



                }
            })
            .catch((err) => {
                console.log(err.message)
                throw err
            })

    },
};