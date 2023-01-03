import { Client, ThreadChannel } from "discord.js"
import express from "express"

export function createRestApi(client: Client) {
    const app = express()
    app.use(express.json())

    app.get("/messages", async (req, res) => {
        const { threadId } = req.query
        if(!threadId) {
            return res.status(400).send("Missing threadId")
        }

        const thread = await client.channels.fetch(threadId as string) as ThreadChannel
        if(!thread) {
            return res.status(404).send("Thread with this id was not found")
        }
        const messages = await thread.messages.fetch()
        return res.status(200).send(JSON.stringify(messages || []))
    })

    app.post("/messages", async (req, res) => {
        const { threadId, text } = req.body
        if(!threadId) {
            return res.status(400).send("Missing threadId")
        }else if(!text) {
            return res.status(400).send("Missing text")
        }

        const thread = await client.channels.fetch(threadId as string) as ThreadChannel
        if(!thread) {
            return res.status(404).send("Thread with this id was not found")
        }
        await thread.send(text)
        return res.status(200).send("Message sent")
    })

    app.post("/resolve", async (req, res) => {
        const { threadId } = req.query
        if(!threadId) {
            return res.status(400).send("Missing threadId")
        }

        const thread = await client.channels.fetch(threadId as string) as ThreadChannel
        if(!thread) {
            return res.status(404).send("Thread with this id was not found")
        }

        await thread.send("This conversation is marked as resolved and thread will be archived")
        await thread.setArchived(true)
        return thread.send("Thread resolved")
    })

    return app
}