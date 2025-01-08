import {PostItModel} from "./PostItModel.ts";

export class PostItListModel {
    public id: number;
    public title: string;
    public postIts: PostItModel[];

    constructor(id: number, title: string, postIts: PostItModel[]) {
        this.id = id;
        this.title = title;
        this.postIts = postIts;
    }
}