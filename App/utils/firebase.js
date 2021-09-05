const admin = require("firebase-admin");
const serviceAccount = process.env.FIREBASE_ADMIN_CREDENTIALS;

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   storageBucket: "growing-nursing.appspot.com",
});

const bucket = admin.storage().bucket();
exports.bucket = bucket;

// bucket.upload();
// bucket.getFiles().then((file) => {
//    console.log(file);
// });

exports.deleteFileFromFirebase = async (fileDest) => {
   try {
      const resp = await admin.storage().bucket().file(fileDest).delete();
      return Promise.resolve({
         status: "ok",
         message: "file deleted successfully",
      });
   } catch (error) {
      return Promise.reject(error);
   }
};
