export const avatarFileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(new Error("Only jpg, jpeg, and png formats are allowed"), false);
  }
  cb(null, true);
};
