import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { projects?: mongoDB.Collection } = {};

export async function connectToDatabase() {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const projectsCollection: mongoDB.Collection = db.collection("projects");

    collections.projects = projectsCollection;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collection: ${projectsCollection.collectionName}`,
    );
}
