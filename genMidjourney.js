require('dotenv').config({ path: __dirname + '/.env' })

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        "MessageContent",
        "GuildMessages",
        "Guilds"
    ]
});
// const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES]});


try {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });

    // WORKS
    client.on('messageCreate', (message) => {
        console.log("GOT A MESSAGE", message);
        if (message.channel.id === '1125566730761154564') {
            // Do something with the message
            console.log(`${message.author.tag}: ${message.content}`);
        }
    });

    client.login(process.env.DISCORD_TOKEN);
} catch (err) {
    console.log("DISCORD ERROR");
    console.log(err);
}