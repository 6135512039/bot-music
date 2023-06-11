const embed = require(`${__dirname}/../../embeds/embeds`);
const { settings } = require(`${__dirname}/../../utilities/players/settings`);
const { finishPlaying } = require(`${__dirname}/../../utilities/players/settings`);

const playerEvents = (player) => {
    player.events.on('connection', async (queue) => {
        queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_connect()] });

        return;
    });

    player.events.on('playerStart', async (queue, track) => {
        return await queue.dashboard.edit({ embeds: [embed.Embed_dashboard('Dashboard', track.title, track.url, track.thumbnail, settings(queue))] });
    });

    player.events.on('audioTrackAdd', async (queue, track) => {
        if (queue.isPlaying()) {
            const author = track.author;
            const timestamp = queue.node.getTimestamp();
            const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

            await queue.metadata.channel.send({ embeds: [embed.Embed_add('Added', track.title, track.url, track.thumbnail, author, trackDuration)] });

            try {
                await queue.dashboard.delete();
            } catch (error) {
                console.log('Dashboard delete error:', error);
            }
            const cur = queue.currentTrack;

            queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_dashboard('Dashboard', cur.title, cur.url, cur.thumbnail, settings(queue))] });

            return;
        }
    });

    player.events.on('playerError', (queue, error) => {
        console.log(`I'm having trouble connecting => ${error.message}`);

        if (error.message.includes('Sign in to confirm your age')) {
            if (queue.tracks.data.length < 1) {
                if (!queue.deleted) {
                    queue.delete();
                } else {
                    finishPlaying(queue);
                }
                
                return queue.metadata.channel.send({ content: `I can't play Age-restricted videos.`, allowedMentions: { repliedUser: false } });
            } else {
                queue.node.skip();

                return queue.metadata.channel.send({ content: `I skipped Age-restricted video.`, allowedMentions: { repliedUser: false } });
            }
        }
    });

    player.events.on('error', (queue, error) => {
        console.log(`There was a problem with the song queue => ${error.message}`);
    });

    player.events.on('disconnect', (queue) => {
        finishPlaying(queue);
    });
}

module.exports = playerEvents;