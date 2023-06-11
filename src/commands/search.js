const { isValidUrl } = require(`../utilities/functions/isValidUrl`);

module.exports = {
    name: 'search',
    aliases: ['search'],

    async execute(client, message, args) {
        if (!args[0]) {
            return message.reply({ content: `❌ | Please enter a valid song name.`, allowedMentions: { repliedUser: false } });
        }
            
        const str = args.join(' ');
        let queryType = '';

        if (isValidUrl(str)) {
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

        await message.react('❤️');

        if (results.playlist || results.tracks.length == 1) {
            queue.addTrack(results.tracks);

            if (!queue.isPlaying()) {
                await queue.node.play()
                    .catch((error) => {
                        console.log(error);
                        return message.reply({ content: `❌ | I can't play this track.`, allowedMentions: { repliedUser: false } });
                    });
            }

            return message.reply({ content: "✅ | Music added.", allowedMentions: { repliedUser: false } });
        } else {
            let select = new StringSelectMenuBuilder()
                .setCustomId("musicSelect")
                .setPlaceholder("Select the music")
                .setOptions(results.tracks.map(x => {
                    return {
                        label: x.title.length >= 25 ? x.title.substring(0, 22) + "..." : x.title,
                        description: x.title.length >= 25 ? `[${x.duration}] ${x.title}`.substring(0, 100) : `Duration: ${x.duration}`,
                        value: x.id
                    }
                }));

            let row = new ActionRowBuilder().addComponents(select);
            let msg = await message.reply({ components: [row] });

            const collector = msg.createMessageComponentCollector({
                time: 20000, // 20s
                filter: i => i.user.id === message.author.id
            });

            collector.on("collect", async i => {
                if (i.customId != "musicSelect") return;

                queue.addTrack(results.tracks.find(x => x.id == i.values[0]));

                if (!queue.isPlaying()) {
                    await queue.node.play()
                        .catch((error) => {
                            console.log(error);
                            return message.reply({ content: `❌ | I can't play this track.`, allowedMentions: { repliedUser: false } });
                        });
                }

                i.deferUpdate();
                return msg.edit({ content: "✅ | Music added.", components: [], allowedMentions: { repliedUser: false } });
            });

            collector.on("end", (collected, reason) => {
                if (reason == "time" && collected.size == 0) {
                    if (!queue?.deleted && !queue.isPlaying()) queue?.delete();
                    return msg.edit({ content: "❌ | Time expired.", components: [], allowedMentions: { repliedUser: false } });
                }
            });
        }
    },
};
