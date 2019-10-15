const { Stream } = require('../models')
const { IsChannel } = require('../funcs/mentions')
const setting = require('../commands/setting')
const config = require('../config')
const axios = require('axios')
const Discord = require('discord.js');
const parseMilliseconds = require('parse-ms');
const loopDuration = 200*1000;
module.exports = {

    init: (discord) => {

        let embeds = []

        let Process = async (twitch, stream) => {
            const guild = discord.guilds.get(stream.server)
            const default_channel = await setting.get(guild, "stream_channel")

            let c = IsChannel(stream.channel, guild) || default_channel.value || null
            if (!c) return true

            const channel = guild.channels.get(c.id)
            //console.log(twitch)
            const liveTime = parseMilliseconds(new Date() - new Date(twitch.started_at))

            const liveStr = (liveTime.days > 0 ? `${liveTime.days}d ` : '') +
                (liveTime.hours > 0 ? `${liveTime.hours}h ` : '') +
                `${liveTime.minutes}m`

            const rndInt = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
            }
            let width = rndInt(800, 1400)
            let thumbnail =  twitch.thumbnail_url.replace("{width}", width).replace("{height}", Math.floor(width/(16/9)))
            thumbnail = `${thumbnail}?time=${Date.now()}`
            //console.log(thumbnail)
           
            const message = embeds.find(em => em.id === stream.id)
            let emb = new Discord.RichEmbed()

            emb.setColor('#0099ff')
                .setTitle(twitch.title)
                .setURL(`https://www.twitch.tv/${twitch.user_name}`)
                .setAuthor(twitch.user_name, twitch.user.profile_image_url, `https://www.twitch.tv/${twitch.user_name}`)
                .setImage(thumbnail)
                .setDescription(`Viewers: ${twitch.viewer_count}`)
                .setTimestamp()
                .setFooter(`Streamed for ${liveStr}`);

            //stream.update({ platform: stream.platform });
            stream.changed('updatedAt', true)
            stream.save()

            if (message)
                return message.msg.edit(emb)

            return channel.send(emb).then(async function (msg) {
                //await msg.react("🆗")
                embeds.push({ id: stream.id, msg: msg })
            })

        }

        setInterval(() => {
            const helix = axios.create({
                baseURL: 'https://api.twitch.tv/helix/',
                headers: { 'Client-ID': config.twitch_client }
            });

            Stream.findAll({ where: { platform: "twitch" } })
                .then(streams => {
                    if (streams.length == 0) return true
                    var str = streams.map(stream => stream.account)

                    helix.get(`streams?user_login=${str.join("&user_login=")}`)
                        .then(res => helix.get(`users?id=${res.data.data.map(d => d.user_id).join("&id=")}`)
                            .then(user_res => {
                                const liveList = []
                                for (var i in res.data.data) {
                                    const twitch = res.data.data[i]
                                    twitch.user = user_res.data.data.find(ur => ur.id === twitch.user_id)

                                    const stream = streams.find(el => el.account.toLowerCase() == twitch.user_name.toLowerCase())
                                    if (!stream) continue
                                    Process(twitch, stream)

                                    if(twitch.type == 'live')
                                        liveList.push(stream.id)
                                }

                                let newEmbs = []
                                for (var i in embeds) {
                                    if (liveList.includes(embeds[i].id)) {
                                        newEmbs.push(embeds[i])
                                        continue
                                    }
                                    embeds[i].msg.delete().then(msg => console.log("destroyed msg"))
                                }
                                embeds = [...newEmbs]
                            }).catch(err => console.log(err))
                        ).catch(err => console.log(err))
                })
                .catch((err) => {
                    console.log(err.message)
                    throw err
                })


        }, loopDuration);

    },
}