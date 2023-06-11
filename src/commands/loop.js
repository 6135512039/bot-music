module.exports = {
    name: 'loop',
    aliases: ['lp'],

    execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);
        const prefix = client.config.prefix;

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ | There is no music currently playing.`, allowedMentions: { repliedUser: false } });
        }
            
        let mode = null;
        const methods = ['Off', 'Single', 'All', 'Autoplay'];

        if (!args[0]) {
            return message.reply({ content: `❌ | ${prefix}loop <ap/all/one/off>`, allowedMentions: { repliedUser: false } });
        }
            
        switch (args[0].toLowerCase()) {
            case 'off':
                mode = 0;
                break;
            case 'one' || 'single':
                mode = 1;
                break;
            case 'all' || 'queue':
                mode = 2;
                break;
            case 'ap' || 'autoplay':
                mode = 3;
                break;
            default:
                return message.reply({ content: `❌ | ${prefix}loop <ap/all/one/off>`, allowedMentions: { repliedUser: false } });
        }

        queue.setRepeatMode(mode);
        message.react('❤️');

        return message.reply({ content: `Set loop to \`${methods[mode]}\``, allowedMentions: { repliedUser: false } });
    },
};
