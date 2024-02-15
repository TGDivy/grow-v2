if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

if (!process.env.DB_CONN_STRING) {
    console.error("DB_CONN_STRING is not set");
    process.exit(1);
}

export const PORT = Number(process.env.PORT) || 8080;
export const DB_CONN_STRING = process.env.DB_CONN_STRING;
