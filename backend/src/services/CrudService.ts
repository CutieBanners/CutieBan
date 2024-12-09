import { DatabaseService } from './DatabaseService';
import { PostItListModel} from '../models/PostItListModel';
import { PostItModel} from '../models/PostItModel';
import { ProjectModel} from '../models/ProjectModel';


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