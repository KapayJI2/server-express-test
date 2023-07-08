import mongoose from 'mongoose';

export const connectToMongo = async () =>
  await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
export const bucket = new mongoose.mongo.GridFSBucket(db, {
  bucketName: 'imagemodels',
});
export const files = db.collection('imagemodels.files');
export const chunks = db.collection('imagemodels.chunks');
