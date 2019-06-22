import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";
import { Post } from "./posts.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class PostService {  
    error = new Subject<string>();
    constructor(private http: HttpClient){}

    createAndStorePosts(title:string, content:string){
        const postData:Post =  { name: title, content: content}
        this.http.post<{name: string}>('https://angular-http-project-76975.firebaseio.com/posts.json', 
          postData,
          {
            observe: 'response'
          }
        )
        .subscribe(response => console.log(response),
         error => this.error.next(error));
    }

    fetchPosts(){
      let httpParams = new HttpParams();
      httpParams = httpParams.append('print', 'pretty');
      httpParams = httpParams.append('custom', 'params');
        return this.http.get<{[key: string]: Post}>('https://angular-http-project-76975.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({"Custom": "header" }),
          params: httpParams
        }
        )
        .pipe(map(responseData => {
          let postsArr: Post[] = [];
          for(let key in responseData){
            if(responseData.hasOwnProperty(key)){
              postsArr.push({...responseData[key], id: key});
            }
          }
          return postsArr;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
        );
    }

    deletePosts(){
        return this.http.delete('https://angular-http-project-76975.firebaseio.com/posts.json',
          {
            observe: 'events',
            responseType: 'text'
          }
        ).pipe(tap(event => {
          if(event.type === HttpEventType.Sent ){
            console.log(event);
          }
          if(event.type === HttpEventType.Response) {
            console.log(event);
          }
        }));
    }
}