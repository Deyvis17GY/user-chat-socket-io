import WebSocket, { WebSocketServer } from "ws"

import chatSchema from "./models/chat.js"

const format = (date, locale, options) => {
  return new Intl.DateTimeFormat(locale, options).format(date || new Date())
}

export const socket = (server) => {
  const wss = new WebSocketServer({ server })
  wss.on("connection", function connection(ws) {
    console.log("A new client Connected!")
    ws.on("message", async function incoming(data, isBinary) {
      try {
        const { type } = JSON.parse(data)
        if (type === "chat") {
          const newData = JSON.parse(data)
          const newMsg = new chatSchema({
            user: newData.user,
            message: newData.message,
            hour: format(new Date(), "en-ES", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true
            })
          })
          await newMsg.save()
        }
      } catch (error) {
        console.error(error)
      }
      console.log("received: %s", data)
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary })
        }
      })
    })
  })
}
