import {PostItModel} from "./PostItModel";

export class PostItListModel {
    public id: string;
    public title: string;
    public order : number;
    public postIts: PostItModel[];
}