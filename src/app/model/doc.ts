export class Doc {

    id: number;
    body: any;
    title: string;
    author: string;

    constructor(id:any, body: any, title: string, author: string) {
        this.body = body;
        this.title = title;
        this.author = author;
        this.id=id;
    }
}
