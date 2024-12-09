import { ProjectModel } from "../models/ProjectModel";
import { PostItModel } from "../models/PostItModel";
import {CookieService} from "@/services/CookieService";
import {ProjectLinkModel} from "@/models/ProjectLinkModel";

export class CrudService {
    private cookieService: CookieService = new CookieService();

    private projects: ProjectModel[] = [
        {
            id: 0,
            title: "Project Title 0",
            postItList: [
                {
                    id: 0,
                    title: "Column 1",
                    order: 1,
                    postIts: [
                        new PostItModel(0, "Card 1", 1,"Description 1", "red", new Date(), ["Alice", "Bob"], ["tag1", "tag2"]),
                        new PostItModel(1, "Card 2", 2,"Description 2", "blue", new Date(), ["Alice", "Charlie"], ["tag2", "tag3"]),
                    ]
                },
                {
                    id: 1,
                    title: "Column 2",
                    order: 2,
                    postIts: [
                        new PostItModel(2, "Card 3", 1,"Description 3", "green", new Date(), ["Bob", "Charlie"], ["tag1", "tag3"]),
                        new PostItModel(3, "Card 4", 2,"Description 4", "yellow", new Date(), ["Alice", "Charlie"], ["tag1", "tag2"]),
                    ]
                }
            ]
        },
        {
            id: 1,
            title: "Project Title 1",
            postItList: [
                {
                    id: 0,
                    title: "Column 1",
                    order: 1,
                    postIts: [
                        new PostItModel(0, "Card 1", 1,"Description 1", "red", new Date(), ["Alice", "Bob"], ["tag1", "tag2"]),
                        new PostItModel(1, "Card 2", 2,"Description 2", "blue", new Date(), ["Alice", "Charlie"], ["tag2", "tag3"]),
                    ]
                },
                {
                    id: 1,
                    title: "Column 2",
                    order: 2,
                    postIts: [
                        new PostItModel(2, "Card 3", 1,"Description 3", "green", new Date(), ["Bob", "Charlie"], ["tag1", "tag3"]),
                        new PostItModel(3, "Card 4", 2,"Description 4", "yellow", new Date(), ["Alice", "Charlie"], ["tag1", "tag2"]),
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "Project Title 3",
            postItList: [
                {
                    id: 0,
                    title: "Column 1",
                    order: 1,
                    postIts: [
                        new PostItModel(0, "Card 1", 1,"Description 1", "red", new Date(), ["Alice", "Bob"], ["tag1", "tag2"]),
                        new PostItModel(1, "Card 2", 2,"Description 2", "blue", new Date(), ["Alice", "Charlie"], ["tag2", "tag3"]),
                    ]
                },
                {
                    id: 1,
                    title: "Column 2",
                    order: 2,
                    postIts: [
                        new PostItModel(2, "Card 3", 1,"Description 3", "green", new Date(), ["Bob", "Charlie"], ["tag1", "tag3"]),
                        new PostItModel(3, "Card 4", 2,"Description 4", "yellow", new Date(), ["Alice", "Charlie"], ["tag1", "tag2"]),
                    ]
                }
            ]
        }
    ];

    getRecentProjects() : ProjectLinkModel[] {
        let savedProjects = this.cookieService.getCookie<ProjectLinkModel[]>("recentProjects");
        if (!savedProjects) {
            savedProjects = [];
        }
        return savedProjects;
    }

    addRecentProject(project: ProjectModel) : void {
        let savedProjects : ProjectLinkModel[] = this.getRecentProjects();
        savedProjects = savedProjects.filter((p : ProjectLinkModel) : boolean => p.id !== project.id);
        savedProjects.unshift(new ProjectLinkModel(project.id, project.title));
        this.cookieService.setCookie("recentProjects", savedProjects);
    }

    // Get a specific project by ID
    getProject(id: number) : ProjectModel | undefined {
        console.log(this.projects);
        const project : ProjectModel | undefined = this.projects.find((project) => {
            return project.id === id;
        });
        if(project){
            this.addRecentProject(project);
        }
        return project;
    }

    // Add a new project
    createProject(title: string) {
        const newProject = new ProjectModel(Date.now(), title, []);
        this.projects.push(newProject);
    }

    // Update a project's title
    updateProject(id: number, title: string) {
        const project = this.getProject(id);
        if (project) {
            project.title = title;
        }
    }

    // Delete a project
    deleteProject(id: number) {
        const index = this.projects.findIndex(project => project.id === id);
        if (index !== -1) {
            this.projects.splice(index, 1);
        }
    }

    // Manage columns (postItList) within a project

    // Add a new column to a project
    addColumnToProject(projectId: number, columnTitle: string) {
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
    removeColumnFromProject(projectId: number, columnId: number) {
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
    addPostItToColumn(projectId: number, columnId: number, postIt: PostItModel) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                column.postIts.push(postIt);
            }
        }
    }

    // Update a postIt within a column
    updatePostItInColumn(projectId: number, columnId: number, postItId: number, updatedPostIt: PostItModel) {
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
    deletePostItFromColumn(projectId: number, columnId: number, postItId: number) {
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
    createPostIt(projectId: number, columnId: number, postIt: PostItModel) {
        const project = this.getProject(projectId);
        if (project) {
            const column = project.postItList.find(col => col.id === columnId);
            if (column) {
                column.postIts.push(postIt);
            }
        }
    }

    // Update a postIt globally (searching through all columns of a project)
    updatePostIt(projectId: number, columnId: number, postItId: number, updatedPostIt: PostItModel) {
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
    deletePostIt(projectId: number, columnId: number, postItId: number) {
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
