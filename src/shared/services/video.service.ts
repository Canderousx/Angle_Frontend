import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {videoObj} from "../../app/home/home.component";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {accountRes} from "./authentication.service";
import {Page} from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

  getVideo(videoId: string){
    return this.http.get<videoObj>(environment.backendUrl+"/unAuth/videos/getVideo?id="+videoId)
  }

  getAuthor(authorId: string){
    return this.http.get<accountRes>(environment.backendUrl+"/unAuth/getAccount?id="+authorId)
  }

  registerView(videoId: string){
    return this.http.patch<serverResponse>(environment.backendUrl+"/unAuth/videos/registerView?id="+videoId,{})
  }

  rateVideo(videoId: string, rate: boolean){
    return this.http.post(environment.backendUrl+"/rateVideo?v="+videoId,rate)
  }

  getUserVideos(channelId: string,page: number, pageSize: number) {
    return this.http.get<Page<videoObj>>(environment.backendUrl+"/unAuth/videos/getUserVideos?id="+channelId+"&page="+page+"&pageSize="+pageSize,{observe:"response"})
  }

  getLatestVideos(pageNum: number){
    return this.http.get<Page<videoObj>>(environment.backendUrl+"/unAuth/videos/getAll?page="+pageNum)
  }

  getMostPopular(){
    return this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getMostPopular")
  }

  getBySubscribers(pageNum:number){
    return this.http.get<Page<videoObj>>(environment.backendUrl+"/unAuth/videos/getBySubscribers?page="+pageNum)
  }

  getSimilarVideos(videoId: string){
    return this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getSimilar?id="+videoId)
  }

  uploadVideo(formData: FormData){
    return this.http.post<serverResponse>(`${environment.backendUrl}/upload`, formData,{observe: 'events', reportProgress: true})
  }

  getThumbnails(videoId:string){
    return this.http.get<string[]>(environment.backendUrl+"/upload/getThumbnails?v="+videoId);
  }

  setMetadata(videoId: string, video: any){
    return this.http.post<serverResponse>(environment.backendUrl+"/upload/setMetadata?id="+videoId,video)
  }

  setExistingVideo(videoId:string){
    return this.http.get<videoObj>(environment.backendUrl+"/unAuth/videos/getVideo?id="+videoId)
  }

  deleteVideo(videoId:string){
    return this.http.delete<serverResponse>(environment.backendUrl+"/deleteVideo?id="+videoId)
  }

  checkRate(videoId:string){
    return this.http.get<number>(environment.backendUrl+"/checkRated?v="+videoId)
  }
}
