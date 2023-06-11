const { isValidUrl } = require(`../utilities/functions/isValidUrl`);

module.exports = {
    name: 'play',

    async execute(client, message, args) {
        if (!args[0]) {
            return message.reply({ content: `❌ | Write the name of the music you want to search.`, allowedMentions: { repliedUser: false } });
        }
            
        const str = args.join(' ');
        let queryType = '';

        if (isValidUrl(str)){
            queryType = client.config.urlQuery;
        } else {
            queryType = client.config.textQuery;
        }

        const results = await client.player.search(str, {
            requestedBy: message.member,
            searchEngine: queryType
        })
            .catch((error) => {
                console.log(error);
                return message.reply({ content: `❌ | The service is experiencing some problems, please try again.`, allowedMentions: { repliedUser: false } });
            });

        if (!results || !results.hasTracks()) {
            return message.reply({ content: `❌ | No results found.`, allowedMentions: { repliedUser: false } });
        }
            
        const queue = await client.player.nodes.create(message.guild, {
            metadata: {
                channel: message.channel,
                client: message.guild.members.me,
                requestedBy: message.user
            },
            selfDeaf: true,
            leaveOnEmpty: client.config.autoLeave,
            leaveOnEnd: client.config.autoLeave,
            leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
            leaveOnEndCooldown: client.config.autoLeaveCooldown,
            skipOnNoStream: true,
            volume: client.config.defaultVolume,
            connectionTimeout: 999_999_999
        });

        try {
            if (!queue.connection)
                await queue.connect(message.member.voice.channel);
        } catch (error) {
            console.log(error);
            if (!queue?.deleted) queue?.delete();
            return message.reply({ content: `❌ | I can't join audio channel.`, allowedMentions: { repliedUser: false } });
        }

        results.playlist ? queue.addTrack(results.tracks) : queue.addTrack(results.tracks[0]);

        if (!queue.isPlaying()) {
            await queue.node.play()
                .catch((error) => {
                    console.log(error);
                    return message.reply({ content: `❌ | I can't play this track.`, allowedMentions: { repliedUser: false } });
                });
        }

        return await message.react('❤️');
    },
};