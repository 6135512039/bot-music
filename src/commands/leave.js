module.exports = {
    name: 'leave',
    aliases: ['l'],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | There is no music currently playing.`, allowedMentions: { repliedUser: false } });
        }
            
        if (!queue.deleted) {
            queue.delete();
        }
            
        return message.react('❤️');
    },
};
