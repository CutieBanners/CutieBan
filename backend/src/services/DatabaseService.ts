import { MongoClient, Db, Collection } from 'mongodb';

export class DatabaseService {
    private client: MongoClient;
    private db: Db;

    constructor(private uri: string, private dbName: string) {
        this.client = new MongoClient(this.uri);
    }

    /**
     * Connects to the database.
     */
    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log(`Connected to database: ${this.dbName}`);
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }

    /**
     * Disconnects from the database.
     */
    public async disconnect(): Promise<void> {
        try {
            await this.client.close();
            console.log('Disconnected from the database.');
        } catch (error) {
            console.error('Failed to disconnect from the database:', error);
            throw error;
        }
    }

    /**
     * Inserts a document into a collection and returns its ID.
     * @param collectionName - The name of the collection.
     * @param document - The document to insert.
     * @returns The inserted document ID.
     */
    public async insertOne<T>(collectionName: string, document: T): Promise<string> {
        try {
            const collection: Collection = this.db.collection(collectionName);
            const result = await collection.insertOne(document);
            return result.insertedId.toString();
        } catch (error) {
            console.error(`Failed to insert document into ${collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Finds a single document in a collection.
     * @param collectionName - The name of the collection.
     * @param query - The query object.
     * @returns The found document or null if not found.
     */
    public async findOne<T>(collectionName: string, query: object): Promise<T | null> {
        try {
            const collection: Collection = this.db.collection(collectionName);
            return await collection.findOne<T>(query);
        } catch (error) {
            console.error(`Failed to find document in ${collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Finds multiple documents in a collection.
     * @param collectionName - The name of the collection.
     * @param query - The query object.
     * @returns An array of found documents.
     */
    public async findMany<T>(collectionName: string, query: object): Promise<T[]> {
        try {
            const collection: Collection = this.db.collection(collectionName);
            return await collection.find<T>(query).toArray();
        } catch (error) {
            console.error(`Failed to find documents in ${collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Updates a document in a collection.
     * @param collectionName - The name of the collection.
     * @param query - The query to identify the document.
     * @param update - The update object.
     * @returns The number of documents updated.
     */
    public async updateOne(collectionName: string, query: object, update: object): Promise<number> {
        try {
            const collection: Collection = this.db.collection(collectionName);
            const result = await collection.updateOne(query, { $set: update });
            return result.modifiedCount;
        } catch (error) {
            console.error(`Failed to update document in ${collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a document from a collection.
     * @param collectionName - The name of the collection.
     * @param query - The query to identify the document.
     * @returns The number of documents deleted.
     */
    public async deleteOne(collectionName: string, query: object): Promise<number> {
        try {
            const collection: Collection = this.db.collection(collectionName);
            const result = await collection.deleteOne(query);
            return result.deletedCount || 0;
        } catch (error) {
            console.error(`Failed to delete document from ${collectionName}:`, error);
            throw error;
        }
    }
}
