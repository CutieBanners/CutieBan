import {PostItListModel} from "./PostItListModel.ts";

export class ProjectModel {
    public id: string;
    public title: string;
    public postItList: PostItListModel[];

    constructor(id: string, title: string, postItList: PostItListModel[]) {
        this.id = id;
        this.title = title;
        this.postItList = postItList;
    }
}