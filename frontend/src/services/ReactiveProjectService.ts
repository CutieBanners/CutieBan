import { reactive, watch, WatchStopHandle } from "vue";
import { ProjectModel } from "@/models/ProjectModel";
import { PostItModel } from "@/models/PostItModel";
import { axiosInstance } from "./AxiosInstance";
import { ProjectWebSocketService } from "./ProjectWebSocketService";

export class ReactiveProjectService {
    public projectChangedCallbacks: (() => void)[] = [];
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
            const project = await this.requestProject(id);
            this.setProject(project);
            this.lastProjectPushContent = this.computeProjectString(project);
            this.socketService.joinProject(id);
        } catch (error) {
            this.setProject(null);
            console.error("Failed to fetch project:", error);
        }
    }

    private async onProjectUpdated(data: any) : Promise<void> {
        if (this.project) {
            try {
                const project = await this.requestProject(this.project.id);
                if(project.lastUpdate.getTime() <= this.project.lastUpdate.getTime()) return;
                Object.assign(this.project, project);
                this.lastProjectPushContent = this.computeProjectString(this.project);
                console.log("Project updated via WebSocket", this.project.postItList);
            } catch (error) {
                console.error("Failed to fetch project:", error);
            }
        }
    }

    private async requestProject(id: string): Promise<ProjectModel> {
        const data : any = (await axiosInstance.get<ProjectModel>(`/projects/${id}`)).data;
        return {...data, lastUpdate: new Date(data.lastUpdate) };
    }

    // Set the current project and start watching it for changes
    private setProject(data: ProjectModel | null): void {
        // Stop any existing watcher before creating a new one
        if (this.stopWatcher) {
            this.stopWatcher();
        }

        if(!data) {
            this.project = null;
            this.projectChangedCallbacks?.forEach(cb => cb());
            return;
        }

        this.project = reactive(data);
        this.projectChangedCallbacks?.forEach(cb => cb());

        // Watch the project for changes
        this.stopWatcher = watch(
            () => this.project,
            async () => {
                const projectString = this.computeProjectString(this.project);
                const needSync = this.lastProjectPushContent !== projectString;
                console.log("Detected local changes, need syncing ?", needSync);
                if(!needSync) return;
                this.lastProjectPushContent = projectString;
                await this.syncProject();
            },
            { deep: true }
        );
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
                this.project.lastUpdate = new Date();
                await axiosInstance.put(`/projects/${this.project.id}`, this.project);
                console.log(`Project with ID ${this.project.id} synced successfully`);
            } catch (error) {
                console.error(`Failed to sync project with ID ${this.project.id}:`, error);
            }
        }
    }

    private computeProjectString(project: ProjectModel): string {
        return JSON.stringify(project, (key, value) => {
            if(key === "lastUpdate") return undefined;
            return value;
        });
    }

    // Get the reactive project
    get currentProject(): reactive<ProjectModel> | null {
        return this.project;
    }
}
