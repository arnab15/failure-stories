const cloudinary = require("cloudinary").v2;

/* cloudinary environment configaration  */

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
uploadImage return promise which upload image to a cloudinary bucket folder
after upload successfull it returns the image details and url in that bucket
*/

const uploadImage = (filePath, folderName) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
         filePath,
         {
            folder: process.env.CLOUDINARY_FOLDER_NAME,
         },
         (error, result) => {
            if (error) {
               return reject(error);
            }
            return resolve(result);
         }
      );
   });
};

/*
  deleteFileFromBucket  Promise delete filein cloudinary bucket from their provided public_id
  then it return ok for sucess and Image did not exist if file not present
  */

const deleteFileFromBucket = (public_id) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (err, res) => {
         if (err || res.result === "not found") {
            return reject(new Error("file not exist"));
         }
         return resolve(res);
      });
   });
};

/*
  updateFile  Promise delete filein cloudinary bucket from their provided public_id
  then it upload new file to bucket and then return file details as promise resolve 
  or for fail return rejected promise
  */

const updateFile = (public_id_prevFile, newFilePath, folderName) => {
   return new Promise((resolve, reject) => {
      deleteFileFromBucket(public_id_prevFile)
         .then(() => uploadImage(newFilePath, folderName))
         .then((res) => {
            return resolve(res);
         })
         .catch((err) => {
            return reject(err);
         });
   });
};

module.exports = {
   uploadImage,
   updateFile,
   deleteFileFromBucket,
};
