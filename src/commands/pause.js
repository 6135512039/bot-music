module.exports = {
    name: 'stop',
    aliases: ['st'],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | There is no music currently playing!.`, allowedMentions: { repliedUser: false } });
        }
            
        const success = queue.node.pause();
        
        return success ? message.react('⏸️') : message.reply({ content: `❌ | Something went wrong.`, allowedMentions: { repliedUser: false } });
    },
};
