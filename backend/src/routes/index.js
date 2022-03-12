import express from "express"
import { upload, s3 } from "../lib/multer.js"
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  getMessages
} from "../controllers/userController.js"

const router = express.Router()

router.get("/messages", getMessages)
router.get("/", getAllUsers)
router.get("/:id", getUser)
router.post("/", upload, createUser)
router.put("/:id", upload, updateUser)
router.delete("/:id", deleteUser)

export default router
