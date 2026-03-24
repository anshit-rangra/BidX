import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, './uploads')
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage })

export default upload;