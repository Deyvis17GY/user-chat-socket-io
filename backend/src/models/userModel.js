import mongoose from "mongoose"

const { Schema } = mongoose

const userSchema = new Schema(
  {
    key: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  { collection: "es" }
)

export default mongoose.model("userImage", userSchema)
