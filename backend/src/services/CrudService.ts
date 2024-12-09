export class PostItListModel {
    public id: number;
    public title: string;
    public order : number;
    public postIts: PostItModel[];
}

export class PostItModel {
    public id: number;
    public title: string;
    public order : number;
    public description: string;
    public color : string;
    public endDate : Date;
    public assignees : string[];
    public tags : string[];
}

export class ProjectModel {
    public id: string;
    public title: string;
    public postItList: PostItListModel[];
}

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



export class CRUDService {
    constructor(private dbService: DatabaseService) {}

    async createPostIt(projectId: string, postItListId: number): Promise<string> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postItList = project.postItList.find(list => list.id === postItListId);
        if (!postItList) {
            throw new Error(`Post-It list with id ${postItListId} not found in project ${projectId}`);
        }

        const newId = project.postItList.flatMap(list => list.postIts).sort((a, b) => b.id - a.id)[0]?.id + 1 || 1;
        const newOrder = postItList.postIts.sort((a, b) => b.order - a.order)[0]?.order + 1 || 1;

        const postIt: PostItModel = {
            id: newId,
            title: 'New Post-It',
            order: newOrder,
            description: '',
            color: 'yellow',
            endDate: new Date(),
            assignees: [],
            tags: [],
        } as PostItModel;

        postItList.postIts.push(postIt);

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });

        return postIt.id.toString();
    }

    async getPostIt(projectId: string, postItId: number): Promise<PostItModel> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postIt = project.postItList.flatMap(list => list.postIts).find(p => p.id === postItId);
        if (!postIt) {
            throw new Error(`Post-It with id ${postItId} not found in project ${projectId}`);
        }

        return postIt;
    }

    async updatePostIt(projectId: string, postItListId: number, postItId: number, postIt: PostItModel): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postItList = project.postItList.find(list => list.id === postItListId);
        if (!postItList) {
            throw new Error(`Post-It list with id ${postItListId} not found in project ${projectId}`);
        }

        const existingPostIt = postItList.postIts.find(p => p.id === postItId);
        if (!existingPostIt) {
            throw new Error(`Post-It with id ${postItId} not found in project ${projectId}`);
        }

        Object.assign(existingPostIt, postIt);

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async deletePostIt(projectId: string, postItId: number): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postItList = project.postItList.find(list => list.postIts.some(p => p.id === postItId));
        if (!postItList) {
            throw new Error(`Post-It with id ${postItId} not found in project ${projectId}`);
        }

        postItList.postIts = postItList.postIts.filter(p => p.id !== postItId);

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async movePostIt(projectId: string, postItId: number, newOrder: number): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postItList = project.postItList.find(list => list.postIts.some(p => p.id === postItId));
        if (!postItList) {
            throw new Error(`Post-It with id ${postItId} not found in project ${projectId}`);
        }

        const postIt = postItList.postIts.find(p => p.id === postItId);
        if (!postIt) {
            throw new Error(`Post-It with id ${postItId} not found in project ${projectId}`);
        }

        const oldOrder = postIt.order;
        postIt.order = newOrder;

        if (newOrder > oldOrder) {
            postItList.postIts.filter(p => p.order > oldOrder && p.order <= newOrder).forEach(p => p.order--);
        } else {
            postItList.postIts.filter(p => p.order < oldOrder && p.order >= newOrder).forEach(p => p.order++);
        }

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async createPostItList(projectId: string): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const newId = project.postItList.sort((a, b) => b.id - a.id)[0]?.id + 1 || 1;

        const postItList: PostItListModel = {
            id: newId,
            title: 'New List',
            order: project.postItList.sort((a, b) => b.order - a.order)[0]?.order + 1 || 1,
            postIts: [],
        } as PostItListModel;

        project.postItList.push(postItList);

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async getPostItList(projectId: string, postItListId: number): Promise<PostItListModel> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postItList = project.postItList.find(list => list.id === postItListId);
        if (!postItList) {
            throw new Error(`Post-It list with id ${postItListId} not found in project ${projectId}`);
        }

        return postItList;
    }

    async updatePostItList(projectId: string, postItListId: number, postItList: PostItListModel): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const existingPostItList = project.postItList.find(list => list.id === postItListId);
        if (!existingPostItList) {
            throw new Error(`Post-It list with id ${postItListId} not found in project ${projectId}`);
        }

        Object.assign(existingPostItList, postItList);

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async deletePostItList(projectId: string, postItListId: number): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        project.postItList = project.postItList.filter(list => list.id !== postItListId);

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async movePostItList(projectId: string, postItListId: number, newOrder: number): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        const postItList = project.postItList.find(list => list.id === postItListId);
        if (!postItList) {
            throw new Error(`Post-It list with id ${postItListId} not found in project ${projectId}`);
        }

        const oldOrder = postItList.order;
        postItList.order = newOrder;

        if (newOrder > oldOrder) {
            project.postItList.filter(list => list.order > oldOrder && list.order <= newOrder).forEach(list => list.order--);
        } else {
            project.postItList.filter(list => list.order < oldOrder && list.order >= newOrder).forEach(list => list.order++);
        }

        await this.dbService.updateOne({ _id: projectId }, { postItList: project.postItList });
    }

    async createProject(title: string): Promise<string> {
        const project = {
            id: "1",
            title: title,
            postItList: [],
        } as ProjectModel;
        project.id = await this.dbService.insertOne(project);
        this.updateProject(project.id, project);
        return project.id;
    }

    async getProject(projectId: string): Promise<ProjectModel> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        return project;
    }

    async updateProject(projectId: string, project: ProjectModel): Promise<void> {
        const existingProject = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!existingProject) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        Object.assign(existingProject, project);

        await this.dbService.updateOne({ _id: projectId }, project);
    }

    async deleteProject(projectId: string): Promise<void> {
        const project = await this.dbService.findOne<ProjectModel>({ _id: projectId });
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        await this.dbService.deleteOne({ _id: projectId });
    }
}