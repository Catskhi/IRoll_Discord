import { Events, Client } from 'discord.js'

export default {
    name: 'Ready',
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user!.tag}`)
    }
}