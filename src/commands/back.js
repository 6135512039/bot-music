module.exports = {
    name: 'back',
    aliases: ['b'],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | No music currently playing.`, allowedMentions: { repliedUser: false } });
        }
            

        if (!queue.history.previousTrack) {
            return message.reply({ content: `❌ | There was no music playing before.`, allowedMentions: { repliedUser: false } });
        }
        
        await queue.history.back();
        
        return await message.react('❤️');
    },
};
