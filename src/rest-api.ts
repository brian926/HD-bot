import { Client, ThreadChannel } from "discord.js"
import express from "express"
import { Request, Response } from "express"

export function createRestApi(client: Client) {
    const app = express()
    app.use(express.json())

    app.get("/messages", async (req, res) => {
        const { thread } = check(req, res)

        const messages = await thread.messages.fetch()
        return res.status(200).send(JSON.stringify(messages || []))
    })

    app.post("/messages", async (req, res) => {
        const { text } = req.body
        const { thread } = check(req, res)

        if(!text) {
            return res.status(400).send("Missing text")
        }
        
        await thread.send(text)
        return res.status(200).send("Message sent")
    })

    app.post("/resolve", async (req, res) => {
        const { thread } = check(req, res)
        
        await thread.send("This conversation is marked as resolved and thread will be archived")
        await thread.setArchived(true)
        return res.status(200).send("Thread resolved")
    })

    async function check(req: Request, res: Response): ThreadChannel {
        const { threadId } = req.query
        if(!threadId) {
            return res.status(400).send("Missing threadId")
        }

        const thread = await client.channels.fetch(threadId as string) as ThreadChannel
        if(!thread) {
            return res.status(404).send("Thread with this id was not found")
        }

        return thread
    }

    return app
}