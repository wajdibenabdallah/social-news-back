import multer from 'multer';
import fileExtension from 'file-extension';

const storage = multer.diskStorage({
  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    cb(null, 'public/storage/posts');
  },

  // Setting name of file saved
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
    // Setting Image Size Limit to 10MBs
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //Error
      cb(new Error('Please upload JPG and PNG images only!'));
    }
    //Success
    cb(undefined, true);
  },
});

export default upload;
