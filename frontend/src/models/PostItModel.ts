export class PostItModel {
    public id: number;
    public title: string;
    public description: string;
    public color : string;
    public endDate : Date | null;
    public assignees : string[];
    public tags : string[];

    constructor(id: number, title: string, description: string, color: string, endDate: Date | null, assignees: string[], tags: string[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.color = color;
        this.endDate = endDate;
        this.assignees = assignees;
        this.tags = tags;
    }
}