import mongoose from 'mongoose';

const connectDb = async (db) => {

    mongoose.connection.on('connected', () => console.log("connected to mongo db"));

    await mongoose.connect(`${process.env.MONGODB_URI}/Sibtbib`)

};

export default connectDb;