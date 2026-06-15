import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "src/uploads/regulations";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);

    cb(null, unique);
  },
});

export const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs allowed"));
    }

    cb(null, true);
  },
});
