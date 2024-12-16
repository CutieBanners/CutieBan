export class PostItModel {
    public id: number;
    public title: string;
    public order : number;
    public description: string;
    public color : string;
    public endDate : Date;
    public assignees : string[];
    public tags : string[];
}