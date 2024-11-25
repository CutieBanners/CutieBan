export class PostItModel {
    public title: string;
    public order : number;
    public description: string;
    public color : string;
    public endDate : Date;
    public assignees : string[];
    public tags : string[];

    constructor(title : string, order : number, description : string, color : string, endDate : Date, assignees : string[], tags : string[]) {
        this.title = title;
        this.order = order;
        this.description = description;
        this.color = color;
        this.endDate = endDate;
        this.assignees = assignees;
        this.tags = tags;
    }
}