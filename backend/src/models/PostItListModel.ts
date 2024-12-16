import {PostItModel} from "./PostItModel";

export class PostItListModel {
    public id: number;
    public title: string;
    public order : number;
    public postIts: PostItModel[];
}