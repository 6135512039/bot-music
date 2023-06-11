const embed = require('../embeds/embeds');

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | There is no music currently playing.`, allowedMentions: { repliedUser: false } });
        }
            
        const track = queue.currentTrack;
        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        let description = `Author : **${track.author}**\nDuration **${trackDuration}**\n`
            + '\n'
            + `${progress} (**${timestamp.progress}**%)`;

        return message.channel.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] });
    },
};
