import { DatabaseService } from './DatabaseService';
import { PostItListModel} from '../models/PostItListModel';
import { PostItModel} from '../models/PostItModel';
import { ProjectModel} from '../models/ProjectModel';


export class CRUDService {
    constructor(private dbService: DatabaseService) {}

    async createProject(title: string): Promise<ProjectModel> {
        const project = {
            title: title,
            postItList: [],
        } as ProjectModel;
        project.id = await this.dbService.insertOne(project);
        this.updateProject(project.id, project);
        return project;
    }

    async getProject(projectId: string): Promise<ProjectModel> {
        let project = await this.dbService.findOne<ProjectModel>(projectId);
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        project.postItList = this.sortByOrder(project.postItList);
        project.postItList.forEach((postItList) => {
            postItList.postIts = this.sortByOrder(postItList.postIts);
        });
        return project;
    }

    async updateProject(projectId: string, project: ProjectModel ): Promise<number> {
        const existingProject = await this.dbService.findOne<ProjectModel>(projectId);
        if (!existingProject) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        Object.assign(existingProject, project);

        return await this.dbService.updateOne(projectId, project);
    }

    async deleteProject(projectId: string): Promise<number> {
        const project = await this.dbService.findOne<ProjectModel>(projectId);
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        return await this.dbService.deleteOne(projectId);
    }

    private sortByOrder<T extends { order: number }>(list: T[]): T[] {
        return list.sort((a, b) => a.order - b.order);
    }
}