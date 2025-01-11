import { axiosInstance } from "./AxiosInstance";
import {ProjectModel} from "@/models/ProjectModel";

export class ProjectsService{
    async createProject(title: string): Promise<ProjectModel> {
        const response = await axiosInstance.post("/projects", { title: title });
        return response.data.project;
    }
}