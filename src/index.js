const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const constants = require(`${__dirname}/utilities/constants`);
const playerEvents = require(`${__dirname}/events/discord-player/player`);

require('console-stamp')(console, 
    {
        format: ':date(yyyy/mm/dd HH:MM:ss)'
    }
);

dotenv.config();

const ENV = process.env;
let client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
        ],
        partials: [Partials.Channel],
        disableMentions: 'everyone'
    }
); 

client.config = constants.config;
client.commands = new Collection();
client.player = new Player(client, 
    {
        autoRegisterExtractor: false,
        ytdlOptions: constants.ytdlOptions
    }
);

const player = client.player;

const setEnvironment = () => {
    return new Promise((resolve, reject) => {
         typeof (ENV.BOT_NAME) === 'undefined'
            ? client.config.name
            : ENV.BOT_NAME;

        client.config.prefix = typeof (ENV.PREFIX) === 'undefined'
            ? client.config.prefix
            : ENV.PREFIX;

        client.config.playing = typeof (ENV.PLAYING) === 'undefined'
            ? client.config.playing
            : ENV.PLAYING;

        client.config.defaultVolume = typeof (ENV.DEFAULT_VOLUME) === 'undefined'
            ? client.config.defaultVolume
            : Number(ENV.DEFAULT_VOLUME);

        client.config.maxVolume = typeof (ENV.MAX_VOLUME) === 'undefined'
            ? client.config.maxVolume
            : Number(ENV.MAX_VOLUME);

        client.config.autoLeave = typeof (ENV.AUTO_LEAVE) === 'undefined'
            ? client.config.autoLeave
            : (String(ENV.AUTO_LEAVE) === 'true' ? true : false);

        client.config.autoLeaveCooldown = typeof (ENV.AUTO_LEAVE_COOLDOWN) === 'undefined'
            ? client.config.autoLeaveCooldown
            : Number(ENV.AUTO_LEAVE_COOLDOWN);

        client.config.displayVoiceState = typeof (ENV.DISPLAY_VOICE_STATE) === 'undefined'
            ? client.config.displayVoiceState
            : (String(ENV.DISPLAY_VOICE_STATE) === 'true' ? true : false);

        client.config.port = typeof (ENV.PORT) === 'undefined'
            ? client.config.port
            : Number(ENV.PORT);

        client.config.textQuery = typeof (ENV.TEXT_QUERY_TYPE) === 'undefined'
            ? client.config.textQuery
            : ENV.TEXT_QUERY_TYPE

        client.config.urlQuery = typeof (ENV.URL_QUERY_TYPE) === 'undefined'
            ? client.config.urlQuery
            : ENV.URL_QUERY_TYPE;

        resolve();
    });
};

const loadFramework = () => {
    console.log('Loading Web Framework');

    return new Promise((resolve, rejects) => {
        const app = express();
        const port = client.config.port || 3333;

        app.get('/', function (req, res) {
            res.send('200 Case Success');
        });

        app.listen(port, function () {
            console.log(`Server start listening port on ${port}`);
            resolve();
        });
    });
};

const loadEvents = () => {
    console.log(`Loading Events`);
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/events/`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            try {
                const event = require(`${__dirname}/events/${file}`);

                client.on(file.split('.')[0], event.bind(null, client));
                delete require.cache[require.resolve(`${__dirname}/events/${file}`)];
            } catch (error) {
                reject(error);
            }
        };

        console.log(`Loading Events Finished`);
        resolve();
    });
};

const loadPlayer = () => {
    console.log('Loading Player Events');

    return new Promise(async (resolve, rejects) => {
        try {
            await player.extractors.loadDefault();
            playerEvents(player, client);
        } catch (error) {
            rejects(error);
        }

        console.log('Loading Player Finished');
        resolve();
    });
};

const loadCommands = () => {
    console.log(`Loading Commands`);

    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/commands/`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            try {
                const command = require(`${__dirname}/commands/${file}`);

                client.commands.set(command.name.toLowerCase(), command);
                delete require.cache[require.resolve(`${__dirname}/commands/${file}`)];
            } catch (error) {
                reject(error);
            }
        };

        console.log(`Loading Commands Finished`);
        resolve();
    })
};

Promise.resolve()
    .then(() => setEnvironment())
    .then(() => loadFramework())
    .then(() => loadEvents())
    .then(() => loadPlayer())
    .then(() => loadCommands())
    .then(() => {
        console.log('All Loaded Successfully');
        client.login(ENV.TOKEN);
    });

process.on('unhandledRejection', error => {
    console.error('Unhandle promise rejection:', error);
});