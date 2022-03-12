import userModel from "../models/userModel.js"
import { upload, s3 } from "../lib/multer.js"
import Chat from "../models/chat.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
    res.status(200).json(users)
  } catch (error) {
    res.json({ message: error.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    res.json({ message: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
      key: req.file.key,
      image: req.file.location
    })

    await newUser.save()

    res.status(200).json(newUser)
  } catch (error) {
    res.json({ message: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const getId = await userModel.findById(req.params.id)

    console.log("OBETNER", getId.key, getId.image)
    const body = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
      key: req.file?.key ? req.file.key : getId.key,
      image: req.file?.location ? req.file.location : getId.image
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, body, {
      new: true
    })
    res.status(200).json(user)
  } catch (error) {
    res.json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const image = await userModel.findByIdAndDelete(req.params.id)
    console.log(image)
    await s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: image.key
      })
      .promise()
    res.status(200).json({ message: "User deleted" })
  } catch (error) {
    res.json({ message: error.message })
  }
}

export const getMessages = async (req, res) => {
  const messages = await Chat.find()
  try {
    const messages = await Chat.find()
    res.status(200).json(messages)
  } catch (error) {
    res.json({ message: error.message })
  }
}
