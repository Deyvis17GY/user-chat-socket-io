import mongoose from "mongoose"
import { config } from "dotenv"
config()

const url = process.env.MONGODB_URI

console.log(url)

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("Connected to MongoDB")
})

export default db
