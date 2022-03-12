import aws from "aws-sdk"
import multer from "multer"
import multerS3 from "multer-s3"
import { config } from "dotenv"
config()

const { S3_ENPOINT, BUCKET_NAME } = process.env

const spacesEnpoint = new aws.Endpoint(S3_ENPOINT)
const s3 = new aws.S3({
  endpoint: spacesEnpoint
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, {
        fieldname: file.fieldname
      })
    },
    key: (req, file, cb) => {
      console.log(file)
      cb(null, file.originalname)
    }
  })
}).single("image")

export { upload, s3 }
