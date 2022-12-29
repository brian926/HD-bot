import { Client } from "discord.js"
import config from "./config"
import * as commandModules from "./commands"

const commands = Object(commandModules)

export const client = new Client({ 
    intents: ["Guilds", "GuildMessages", "DirectMessages"]
})

client.once("ready", () => {
    console.log("Discord bot is ready1")
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName } = interaction
    commands[commandName].execute(interaction, client)
})

client.login(config.DISCORD_TOKEN)