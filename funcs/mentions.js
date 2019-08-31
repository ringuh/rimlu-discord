const Mention = {
    IsUser: (mention, guild) => {
        if (!mention) return;
        
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }

            return guild.members.get(mention)
        }
        return guild.members.get(mention)
    },
    IsChannel: (mention, guild) => {
        if (!mention) return;
        
        if (mention.startsWith('<#') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }

            return guild.channels.get(mention)
        }

        return guild.channels.get(mention)
    },

    IsMention: (mention, guild) => {
        let reply = Mention.IsUser(mention, guild)
        if (reply) return [reply, "discord_user"]
        reply = Mention.IsChannel(mention, guild)
        if (reply) return [reply, "discord_channel"]

        return [mention, null]

    },

};

module.exports = Mention