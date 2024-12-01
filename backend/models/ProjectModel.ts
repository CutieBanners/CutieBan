import {PostItListModel} from "./PostItListModel";

export class ProjectModel {
    public title: string;
    public postItList: PostItListModel[];

    constructor(title: string, postItList: PostItListModel[]) {
        this.title = title;
        this.postItList = postItList;
    }
}