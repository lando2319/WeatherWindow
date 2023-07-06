require('dotenv').config({ path: __dirname + '/.env' })
var downloadPhoto = require("./utility/downloadPhoto.js");
var util = require("util");

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

        var messages = await channel.messages.fetch({limit:1})

        if (messages && messages.first() && messages.first().attachments.first()) {
            var photoURL = messages.first().attachments.first().url

            console.log("New Image URL Found", photoURL);
            process.exit(0);
        } else {
            console.log("No Messages Found");
            process.exit(0);
        }
    } catch (err) {
        console.log("DISCORD ERROR");
        console.log(err);
        process.exit(1);
    }
})();
