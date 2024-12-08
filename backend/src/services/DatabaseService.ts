import { MongoClient, Db, Collection } from 'mongodb';

export class DatabaseService {
    private client: MongoClient;
    private db: Db;
    private collection: Collection;

    constructor(private uri: string, private dbName: string, private collectionName: string) {
        this.client = new MongoClient(this.uri);
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(collectionName);
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
     * Inserts a document into the collection and returns its ID.
     * @param document - The document to insert.
     * @returns The inserted document ID.
     */
    public async insertOne<T>(document: T): Promise<string> {
        try {
            const result = await this.collection.insertOne(document);
            return result.insertedId.toString();
        } catch (error) {
            console.error(`Failed to insert document:`, error);
            throw error;
        }
    }

    /**
     * Finds a single document in the collection.
     * @param query - The query object.
     * @returns The found document or null if not found.
     */
    public async findOne<T>(query: object): Promise<T | null> {
        try {
            return await this.collection.findOne<T>(query);
        } catch (error) {
            console.error(`Failed to find document:`, error);
            throw error;
        }
    }

    /**
     * Finds multiple documents in the collection.
     * @param query - The query object.
     * @returns An array of found documents.
     */
    public async findMany<T>(query: object): Promise<T[]> {
        try {
            return await this.collection.find<T>(query).toArray();
        } catch (error) {
            console.error(`Failed to find documents:`, error);
            throw error;
        }
    }

    /**
     * Updates a document in the collection.
     * @param query - The query to identify the document.
     * @param update - The update object.
     * @returns The number of documents updated.
     */
    public async updateOne(query: object, update: object): Promise<number> {
        try {
            const result = await this.collection.updateOne(query, { $set: update });
            return result.modifiedCount;
        } catch (error) {
            console.error(`Failed to update document:`, error);
            throw error;
        }
    }

    /**
     * Deletes a document from the collection.
     * @param query - The query to identify the document.
     * @returns The number of documents deleted.
     */
    public async deleteOne(query: object): Promise<number> {
        try {
            const result = await this.collection.deleteOne(query);
            return result.deletedCount || 0;
        } catch (error) {
            console.error(`Failed to delete document:`, error);
            throw error;
        }
    }
}