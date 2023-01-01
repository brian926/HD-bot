import { Client, ThreadChannel } from "discord.js"
import express from "express"
import { Response } from "express"

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

    type ThreadT = {
        ThreadId: string,
        Thread: ThreadChannel,
        Res: Response
    }

    app.post("/resolve", async (req, res) => {
        const { threadId } = req.query
        // if(!threadId) {
        //     return res.status(400).send("Missing threadId")
        // }

        // const thread = await client.channels.fetch(threadId as string) as ThreadChannel
        // if(!thread) {
        //     return res.status(404).send("Thread with this id was not found")
        // }
        const thread = checkT(threadId, res)

        await (await thread).Thread.send("This conversation is marked as resolved and thread will be archived")
        await (await thread).Thread.setArchived(true)
        return (await thread).Res.send("Thread resolved")
    })

    async function checkT(threadId: any, res: Response) {
        const resT = res.status(200)
        if(!threadId) {
            const resT = res.status(400).send("Missing threadId")
        }
        
        const thread = await client.channels.fetch(threadId as string) as ThreadChannel
        if(!thread) {
            const resT = res.status(404).send("Thread with this id was not found")
        }

        const test: ThreadT = {
            ThreadId: threadId,
            Thread: thread,
            Res: resT
        }

        return test
    }

    return app
}