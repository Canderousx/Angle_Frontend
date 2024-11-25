import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {serverResponse} from "../../app/app.component";
import {environment} from "../../environments/environment.development";
import {Comment} from "../models/comment";
import {Page} from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  deleteComment(id: string) {
    return this.http.delete<serverResponse>(environment.backendUrl+"/auth/comments/delete?id="+id)
  }

  addComment(comment: Comment){
    return this.http.post<Comment[]>(environment.backendUrl+"/comments/addComment",comment,{observe:"response"});
  }

  loadComments(videoId: string, page: number, pageSize: number) {
    return this.http.get<Page<Comment>>(environment.backendUrl+"/unAuth/videos/getComments?id="+videoId+"&page="+page+"&pageSize="+pageSize,{observe:"response"})
  }

  getComment(id: string){
    return this.http.get<Comment>(environment.backendUrl+"/comments/getComment?id="+id);
  }


}
