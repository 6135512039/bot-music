const dotenv = require('dotenv');
const Discord = require('discord.js');
const ENV = process.env;
const color = typeof (process.env.EMBEDS_COLOR) === 'undefined' ? '#FFFFFF' : (ENV.EMBEDS_COLOR);

dotenv.config();

module.exports = {
    Embed_dashboard: function (status, music_title, music_url, music_thumbnail, music_description) {
        const Embed_dashboard = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: music_description })
            .setTimestamp()
        return Embed_dashboard;
    },

    Embed_add: function (status, music_title, music_url, music_thumbnail, music_author, music_length) {
        const Embed_add = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: `Author : **${music_author}**\nDuration **${music_length}**`, inline: true })
            .setTimestamp()
        return Embed_add;
    },

    Embed_queue: function (status, nowplay, queueMsg, loopStatus) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .addFields({ name: nowplay, value: queueMsg })
            .setTimestamp()
            .setFooter({ text: `Loop: ${loopStatus}` });
        return Embed_queue;
    },

    Embed_search: function (music_title, description) {
        const Embed_search = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setDescription(description)
            .setTimestamp()
        return Embed_search;
    },

    Embed_connect: function () {
        const Embed_connect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('Voice channel connected successfully.')
        return Embed_connect;
    },

    Embed_disconnect: function () {
        const Embed_disconnect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('Finished playing.')
        return Embed_disconnect;
    }
}