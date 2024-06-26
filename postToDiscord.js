require('dotenv').config({ path: __dirname + '/.env' })

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        "MessageContent",
        "GuildMessages",
        "Guilds"
    ]
});

var channelID = "1125566730761154564";

(async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
        console.log("LOGGED IN", client.user.tag)

        const channel = await client.channels.fetch(channelID);
        await channel.send('/Imagine "');
        console.log("Successfully made query");
        process.exit(0);

    } catch (err) {
        console.log("DISCORD ERROR");
        console.log(err);
        process.exit(1);
    }
})();