module.exports = {
    name: 'random',
    aliases: ['rd'],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | There is no music currently playing!.`, allowedMentions: { repliedUser: false } });
        }
            
        queue.tracks.shuffle();

        return message.react('❤️');
    },
};
