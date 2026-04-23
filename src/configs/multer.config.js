import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_FOLDER = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${file.originalname.split("").at(1)}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({ storage });
