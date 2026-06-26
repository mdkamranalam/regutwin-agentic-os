import multer from "multer";
import path from "path";
import fs from "fs";

const regPath = "src/uploads/regulations";
const evidencePath = "src/uploads/evidence";

[regPath, evidencePath].forEach((p) => {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, regPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const evidenceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, evidencePath);
  },
  filename: (req, file, cb) => {
    cb(null, `evidence_${Date.now()}_${file.originalname}`);
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

export const uploadEvidence = multer({
  storage: evidenceStorage,
});
