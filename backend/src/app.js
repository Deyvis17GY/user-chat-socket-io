import express from "express"
import cors from "cors"
import db from "./database/db.js"
import WebSocket, { WebSocketServer } from "ws"
import { createServer } from "http"
import router from "./routes/index.js"
import { socket } from "./socket.js"

const app = express()

const server = createServer(app)
socket(server)
app.use(cors())
app.set("port", process.env.PORT || 3001)
app.use(express.json())
app.use("/api", router)

app.get("/", (req, res) => {
  res.send("Welcome to the chat app")
})

server.listen(app.get("port"), () => {
  console.log("Server is running on port ", app.get("port"))
})
