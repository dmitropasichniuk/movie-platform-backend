import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

export const avatarStorage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});
