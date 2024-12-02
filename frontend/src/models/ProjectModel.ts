import {PostItListModel} from "./PostItListModel.ts";

export class ProjectModel {
    public id: number;
    public title: string;
    public postItList: PostItListModel[];

    constructor(id: number, title: string, postItList: PostItListModel[]) {
        this.id = id;
        this.title = title;
        this.postItList = postItList;
    }
}