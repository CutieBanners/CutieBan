import { ProjectModel } from "../models/ProjectModel";
import { PostItModel } from "../models/PostItModel";
import { CookieService } from "@/services/CookieService";
import { ProjectLinkModel } from "@/models/ProjectLinkModel";
import { reactive } from "vue";

export class CrudService {
    private cookieService: CookieService = new CookieService();

    private projects: ProjectModel[] = reactive([
        {
            id: 0,
            title: "Project Title 0",
            postItList: [
                {
                    id: 0,
                    title: "Column 1",
                    order: 1,
                    postIts: [
                        new PostItModel(0, "Card 1", 1, "Description 1", "red", new Date(), ["Alice", "Bob"], ["tag1", "tag2"]),
                        new PostItModel(1, "Card 2", 2, "Description 2", "blue", new Date(), ["Alice", "Charlie"], ["tag2", "tag3"]),
                    ]
                },
                {
                    id: 1,
                    title: "Column 2",
                    order: 2,
                    postIts: [
                        new PostItModel(2, "Card 3", 1, "Description 3", "green", new Date(), ["Bob", "Charlie"], ["tag1", "tag3"]),
                        new PostItModel(3, "Card 4", 2, "Description 4", "yellow", new Date(), ["Alice", "Charlie"], ["tag1", "tag2"]),
                    ]
                }
            ]
        },
    ]);

    // Get a specific project by ID
    getProject(id: string): ProjectModel | undefined {
        const project = this.projects.find((project) => project.id === id);
        return project;
    }

    // Add a new project
    createProject(title: string) {
        const newProject = new ProjectModel(Date.now(), title, []);
        this.projects.push(newProject);
    }

    // Update a project's title
    updateProject(id: string, title: string) {
        const project = this.getProject(id);
        if (project) {
            project.title = title;
        }
    }

    // Delete a project
    deleteProject(id: string) {
        const index = this.projects.findIndex(project => project.id === id);
        if (index !== -1) {
            this.projects.splice(index, 1);
        }
    }

    // Manage columns (postItList) within a project

    // Add a new column to a project
    addColumnToProject(projectId: string, columnTitle: string) {
        const project = this.getProject(projectId);
        if (project) {
            const newColumn = {
                id: Date.now(),
                title: columnTitle,
                order: project.postItList.length + 1,
                postIts: [] as PostItModel[],
            };
            project.postItList.push(newColumn);
        }
    }

    // Remove a column from a project
    removeColumnFromProject(projectId: string, columnId: string) {
        const project = this.getProject(projectId);
        if (project) {
            const index = project.postItList.findIndex(column => column.id === columnId);
            if (index !== -1) {
                project.postItList.splice(index, 1);
            }
        }
    }

    // Manage postIts (cards) within columns

    // Add a new postIt to a column
    addPostItToColumn(projectId: string, columnId: string, postIt: PostItModel) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                column.postIts.push(postIt);
            }
        }
    }

    // Update a postIt within a column
    updatePostItInColumn(projectId: string, columnId: string, postItId: string, updatedPostIt: PostItModel) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                const postItIndex = column.postIts.findIndex(postIt => postIt.id === postItId);
                if (postItIndex !== -1) {
                    column.postIts[postItIndex] = updatedPostIt;
                }
            }
        }
    }

    // Delete a postIt from a column
    deletePostItFromColumn(projectId: string, columnId: string, postItId: string) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                const postItIndex = column.postIts.findIndex(postIt => postIt.id === postItId);
                if (postItIndex !== -1) {
                    column.postIts.splice(postItIndex, 1);
                }
            }
        }
    }

    // CRUD Operations for PostItModel (direct)

    // Add a new postIt globally (not tied to a column, but specifying projectId and columnId)
    createPostIt(projectId: string, columnId: string, postIt: PostItModel) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                column.postIts.push(postIt);
            }
        }
    }

    // Update a postIt globally (searching through all columns of a project)
    updatePostIt(projectId: string, columnId: string, postItId: string, updatedPostIt: PostItModel) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                const postItIndex = column.postIts.findIndex(postIt => postIt.id === postItId);
                if (postItIndex !== -1) {
                    column.postIts[postItIndex] = updatedPostIt;
                }
            }
        }
    }

    // Delete a postIt globally (searching through all columns of a project)
    deletePostIt(projectId: string, columnId: string, postItId: string) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                const postItIndex = column.postIts.findIndex(postIt => postIt.id === postItId);
                if (postItIndex !== -1) {
                    column.postIts.splice(postItIndex, 1);
                }
            }
        }
    }
}
