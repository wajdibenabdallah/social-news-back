import multer from 'multer';
import fileExtension from 'file-extension';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case 'userImage':
        cb(null, 'public/storage/user');
        break;
      case 'publicationImage':
        cb(null, 'public/storage/publication');
        break;
      default:
        cb(null, 'public/storage');
    }
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload JPG and PNG images only!'));
    }
    cb(undefined, true);
  },
});

export default upload;
