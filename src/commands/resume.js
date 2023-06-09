module.exports = {
    name: 'resume',
    aliases: ['rs'],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue) {
            return message.reply({ content: `❌ | There is no music currently playing.`, allowedMentions: { repliedUser: false } });
        }
            
        const success = queue.node.resume();

        return success ? message.react('▶️') : message.reply({ content: `❌ | Something went wrong.`, allowedMentions: { repliedUser: false } });
    },
};
