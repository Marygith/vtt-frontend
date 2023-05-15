import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doc} from "../model/doc";
// import 'url-search-params-polyfill';

@Injectable({
    providedIn: 'root'
})
export class DocService {


    /*   headers = new HttpHeaders()
        .set('Content-Type', 'application/json;charset=UTF-8')*/



    private readonly endpoint: string;

    constructor(private http: HttpClient) {
        this.endpoint = 'http://localhost:8080/media';
    }

    public getDoc(): Observable<Doc> {
        return this.http.get<Doc>(this.endpoint);
    }

    public save(doc: Doc) {
        // const params = new HttpParams()
        //   .set('id', `${doc.id}`)
        //   .set('title', `${doc.title}`)
        //   .set('body', `${doc.body}`)
        //   .set('author', `${doc.author}`);
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            })/*,
      params:  new HttpParams()
        .set('id', `${doc.id}`)
        .set('title', `${doc.title}`)
        .set('body', `${doc.body}`)
        .set('author', `${doc.author}`)*/
        };
        return this.http.post<any>(this.endpoint,/*{id:1, body:'c', title:'b', author:'cc'}*/doc, options);
    }

    public sendVideo(formData: FormData) {
        this.http.post('http://localhost:8080/upload', formData, { observe: 'response' })
            .subscribe((response) => {}

            );
    }

    public getText() {
        return this.http.get<Doc>('http://localhost:8080/text');
    }


    public startDivision(doc: Doc) {
        console.log("starting division at client side")
        // const params = new HttpParams()
        //   .set('id', `${doc.id}`)
        //   .set('title', `${doc.title}`)
        //   .set('body', `${doc.body}`)
        //   .set('author', `${doc.author}`);
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            })/*,
      params:  new HttpParams()
        .set('id', `${doc.id}`)
        .set('title', `${doc.title}`)
        .set('body', `${doc.body}`)
        .set('author', `${doc.author}`)*/
        };
        return this.http.post<any>('http://localhost:8080/division',/*{id:1, body:'c', title:'b', author:'cc'}*/doc, options).subscribe((response) => {});
    }

}
