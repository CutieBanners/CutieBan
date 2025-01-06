import {PostItModel} from "./PostItModel.ts";

export class PostItListModel {
    public id: string;
    public title: string;
    public order : number;
    public postIts: PostItModel[];

    constructor(id: string, title: string, order: number, postIts: PostItModel[]) {
        this.id = id;
        this.title = title;
        this.order = order;
        this.postIts = postIts;
    }
}