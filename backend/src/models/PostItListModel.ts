import {PostItModel} from "./PostItModel";

export class PostItListModel {
    public id: number;
    public title: string;
    public order : number;
    public postIts: PostItModel[];

    constructor(id: number, title: string, order: number, postIts: PostItModel[]) {
        this.id = id;
        this.title = title;
        this.order = order;
        this.postIts = postIts;
    }
}