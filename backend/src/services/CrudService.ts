import { DatabaseService } from './DatabaseService';
import { PostItListModel} from '../models/PostItListModel';
import { PostItModel} from '../models/PostItModel';
import { ProjectModel} from '../models/ProjectModel';

/**
 * Service class for CRUD operations on projects.
 * This class is responsible for creating, reading, updating, and deleting projects.
 */
export class CRUDService {
    constructor(private dbService: DatabaseService) {}

    /**
     * Creates a new project and gives it MongoDB ID as id.
     * @param title - The title of the project.
     * @returns The created project.
     */
    async createProject(title: string): Promise<ProjectModel> {
        const project = {
            title: title,
            postItList: [],
        } as ProjectModel;
        project.id = await this.dbService.insertOne(project);
        this.updateProject(project.id, project);
        return project;
    }

    /**
     * Retrieves a project by its MongoDB ID.
     * @param projectId - The ID of the project to retrieve.
     * @returns The project with the specified ID.
     */
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

    /**
     * updates a project by its MongoDB ID.
     * @param projectId - The ID of the project to update.
     * @param project - The updated project data.
     * @returns The number of documents updated.
     */
    async updateProject(projectId: string, project: ProjectModel ): Promise<number> {
        const existingProject = await this.dbService.findOne<ProjectModel>(projectId);
        if (!existingProject) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        Object.assign(existingProject, project);

        return await this.dbService.updateOne(projectId, project);
    }


    /**
     * Deletes a project by its MongoDB ID.
     * @param projectId
     * @returns number
     */
    async deleteProject(projectId: string): Promise<number> {
        const project = await this.dbService.findOne<ProjectModel>(projectId);
        if (!project) {
            throw new Error(`Project with id ${projectId} not found`);
        }

        return await this.dbService.deleteOne(projectId);
    }

    /**
     * Sorts a list of <T> by order.
     * @constraint <T> must have an order property.
     * @param list
     * @returns list sorted by order
     */
    private sortByOrder<T extends { order: number }>(list: T[]): T[] {
        return list.sort((a, b) => a.order - b.order);
    }
}