import mongoose from "mongoose";
import { DB_CONN_STRING } from "../constants";
import { logger } from "./logger";

const connect = async () => {
    const uri = DB_CONN_STRING;

    try {
        const con = await mongoose.connect(uri);
        logger.info("Connected to database");
        return con;
    } catch (error) {
        logger.error("Error connecting to database: ", error);
    }
};

export default connect;
