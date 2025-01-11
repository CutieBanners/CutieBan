import { CookieService } from "@/services/CookieService";
import { ProjectLinkModel } from "@/models/ProjectLinkModel";
import { ProjectModel } from "@/models/ProjectModel";
import { ref } from "vue";

export class RecentProjectsService {
    private cookieService: CookieService = new CookieService();
    private recentProjects : Ref<ProjectLinkModel[]> = ref<ProjectLinkModel[]>([]);

    getRecentProjects(): Ref<ProjectLinkModel[]> {
        this.recentProjects.value = this.cookieService.getCookie<ProjectLinkModel[]>("recentProjects");
        if (!this.recentProjects.value) {
            this.recentProjects.value = [];
        }
        return this.recentProjects;
    }

    addRecentProject(project: ProjectModel): void {
        if (!Array.isArray(this.recentProjects.value)) {
            this.recentProjects.value = []; // Initialize if not already an array
        }
        this.recentProjects.value = this.recentProjects.value.filter(p => p.id !== project.id);
        this.recentProjects.value.unshift(new ProjectLinkModel(project.id, project.title));
        this.cookieService.setCookie("recentProjects", this.recentProjects.value);
    }
}
