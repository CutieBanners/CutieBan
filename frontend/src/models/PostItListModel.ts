import {PostItModel} from "./PostItModel.ts";

export class PostItListModel {
    public title: string;
    public order : number;
    public postIts: PostItModel[];

    constructor(title: string, order: number, postIts: PostItModel[]) {
        this.title = title;
        this.order = order;
        this.postIts = postIts;
    }
}