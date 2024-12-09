import {PostItListModel} from "./PostItListModel";

export class ProjectModel {
    public id: string;
    public title: string;
    public postItList: PostItListModel[];
}