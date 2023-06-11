module.exports = {
    name: 'skip',
    aliases: ['sk'],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | There is no music currently playing.`, allowedMentions: { repliedUser: false } });
        }
            
        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            queue.node.skip();
            await wait(500);
            queue.setRepeatMode(1);
        }
        else {
            queue.node.skip();
        }

        return message.react('❤️');
    },
};

const wait = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};