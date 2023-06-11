const { color } = require(`${__dirname}/../utilities/constants`);

let pool = [];

module.exports = async (client, oldState, newState) => {
    const display = client.config.displayVoiceState;

    if (newState.channelId === null && display) {
        console.log(`${color.grey}-- ${newState.member.user.username} left channel${color.white}`);
    } else if (oldState.channelId === null && display) {
        console.log(`${color.grey}-- ${newState.member.user.username} joined channel ${newState.channel.name}${color.white}`);
    } else if (display) {
        console.log(`${color.grey}-- ${newState.member.user.username} moved channel ${oldState.channel.name} to ${newState.channel.name}${color.white}`);

        if (!oldState.member.user.bot) {
            const queue = await client.player.nodes.get(oldState.guild.id);
            const botChannelId = queue?.connection?.channel?.id;
            const oldChannelId = oldState.channel.id;
            const newChannelId = newState.channel.id;

            if (botChannelId === oldChannelId) {
                if (oldState.channel.members.size <= 1) {
                    let timeoutID = setTimeout(() => {
                        client.player.deleteQueue(oldState.guild.id);
                    }, client.config.autoLeaveCooldown);

                    pool.push({
                        guildId: oldState.guild.id,
                        timeoutId: timeoutID
                    });
                }
            } else if (botChannelId === newChannelId) {
                if (newState.channel.members.size > 1 && newState.channel.members.size <= 2) {
                    for (var i = 0; i < pool.length; i++) {
                        if (pool[i].guildId === newState.guild.id) {
                            clearTimeout(pool[i].timeoutId);
                            pool.splice(i, 1);
                        }
                    }
                }
            }
        }
    }
};