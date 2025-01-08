import {PostItListModel} from "./PostItListModel.ts";

export class ProjectModel {
    public id: string;
    public title: string;
    public postItList: PostItListModel[];
    public lastUpdate: Date;

    constructor(id: string, title: string, postItList: PostItListModel[], lastUpdate: Date) {
        this.id = id;
        this.title = title;
        this.postItList = postItList;
        this.lastUpdate = lastUpdate;
    }
}