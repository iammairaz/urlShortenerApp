import { APP_PORT, MONGO_URI } from "./config/config";
import expressApp from "./expressApp";
import { logger } from "./utils";
import { mongoConnection } from "./dbManager/dbConnection";

const PORT = APP_PORT || 8000;

export const StartServer = async () => {
    expressApp.listen(PORT, () => {
        logger.info(`App is listening to ${PORT}`)
    })

    process.on("uncaughtException", async (err) => {
        logger.error(err);
        process.exit(1);
    });
};

StartServer().then(() => {
    mongoConnection(MONGO_URI)
    logger.info("Server is up");
});