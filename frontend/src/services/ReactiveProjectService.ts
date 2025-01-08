import { reactive, watch, WatchStopHandle } from "vue";
import { ProjectModel } from "@/models/ProjectModel";
import { PostItModel } from "@/models/PostItModel";
import { axiosInstance } from "./AxiosInstance";
import { ProjectWebSocketService } from "./ProjectWebSocketService";

export class ReactiveProjectService {
    private project: reactive<ProjectModel> | null = null;
    private stopWatcher: WatchStopHandle | null = null;
    private socketService: ProjectWebSocketService;
    private lastProjectPushContent: string | null = null;

    constructor() {
        this.socketService = new ProjectWebSocketService();
        this.socketService.onProjectUpdated = this.onProjectUpdated.bind(this);
    }

    // Fetch a project from the server by ID and set it as the current project
    async fetchProject(id: string): Promise<void> {
        try {
            const response = await axiosInstance.get<ProjectModel>(`/projects/${id}`);
            this.setProject(response.data);
            this.socketService.joinProject(id);
        } catch (error) {
            this.setProject(null);
            console.error("Failed to fetch project:", error);
        }
    }

    private async onProjectUpdated(data: any) : Promise<void> {
        if (this.project) {
            try {
                const response = await axiosInstance.get<ProjectModel>(`/projects/${this.project.id}`);
                Object.assign(this.project, response.data);
                console.log("Project updated via WebSocket", this.project.postItList);
            } catch (error) {
                console.error("Failed to fetch project:", error);
            }
        }
    }

    // Set the current project and start watching it for changes
    private setProject(data: ProjectModel | null): void {
        // Stop any existing watcher before creating a new one
        if (this.stopWatcher) {
            this.stopWatcher();
        }

        if(!data) {
            this.project = null;
            return;
        }

        this.project = reactive(data);

        // Watch the project for changes
        this.stopWatcher = watch(
            () => this.project,
            async () => {
                const projectString = JSON.stringify(this.project);
                const needSync = this.lastProjectPushContent !== projectString;
                console.log("Detected local changes, need syncing ?", needSync);
                if(!needSync) return;
                this.lastProjectPushContent = projectString;
                await this.syncProject();
            },
            { deep: true }
        );
    }

    // Update the project's title
    updateProject(title: string): void {
        if (this.project) {
            this.project.title = title;
        }
    }

    // Add a new column to the project
    addColumn(title: string): void {
        if (this.project) {
            const newColumn = {
                id: Date.now(),
                title,
                postIts: [] as PostItModel[],
            };
            this.project.postItList.push(newColumn);
        }
    }

    // Remove a column from the project
    removeColumn(columnId: number): void {
        if (this.project) {
            const index = this.project.postItList.findIndex(column => column.id === columnId);
            if (index !== -1) {
                this.project.postItList.splice(index, 1);
            }
        }
    }

    // Add a new PostIt to a specific column
    createPostIt(columnId: number, postIt: PostItModel): void {
        if (this.project) {
            const column : PostItListMode = this.project.postItList.find(col => col.id === columnId);
            if (column) {
                column.postIts.push(postIt);
            }
        }
    }

    // Update an existing PostIt in a specific column
    updatePostIt(columnId: number, postItId: number, updatedPostIt: PostItModel): void {
        if (this.project) {
            const column = this.project.postItList.find(col => col.id === columnId);
            if (column) {
                const postItIndex = column.postIts.findIndex(postIt => postIt.id === postItId);
                if (postItIndex !== -1) {
                    column.postIts[postItIndex] = updatedPostIt;
                }
            }
        }
    }

    // Delete a PostIt from a specific column
    deletePostIt(columnId: number, postItId: number): void {
        if (this.project) {
            const column = this.project.postItList.find(col => col.id === columnId);
            if (column) {
                const postItIndex = column.postIts.findIndex(postIt => postIt.id === postItId);
                if (postItIndex !== -1) {
                    column.postIts.splice(postItIndex, 1);
                }
            }
        }
    }

    // Push updates to the server
    private async syncProject(): Promise<void> {
        if (this.project) {
            try {
                await axiosInstance.put(`/projects/${this.project.id}`, this.project);
                console.log(`Project with ID ${this.project.id} synced successfully`);
            } catch (error) {
                console.error(`Failed to sync project with ID ${this.project.id}:`, error);
            }
        }
    }

    // Get the reactive project
    get currentProject(): reactive<ProjectModel> | null {
        return this.project;
    }
}
