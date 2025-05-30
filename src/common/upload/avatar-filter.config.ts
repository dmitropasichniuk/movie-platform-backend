export const avatarFileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(new Error('Дозволено лише jpg/jpeg/png'), false);
  }
  cb(null, true);
};