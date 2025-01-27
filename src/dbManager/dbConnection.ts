import mongoose from "mongoose";
import { logger } from "../utils";

const mongoConnection = async (connString: string) => {
    const MONGO_OPTIONS = {
        socketTimeoutMS: 30000,
        autoIndex: false,
        // useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false
    }
    await mongoose.connect(connString, MONGO_OPTIONS).then(() => {
        logger.info(`Connected to ${process.env.NODE_ENV} MongoDb`);
    }).catch(error => {
        logger.error('Error: Could not connect to data base: ' + error);
    })
}

export {mongoConnection}
