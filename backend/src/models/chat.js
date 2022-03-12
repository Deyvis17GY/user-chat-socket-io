import mongoose from "mongoose"

const { Schema } = mongoose

const chatSchema = new Schema(
  {
    user: String,
    message: String,
    hour: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "chat" }
)

export default mongoose.model("Chat", chatSchema)
