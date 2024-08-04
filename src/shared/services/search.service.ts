import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {videoObj} from "../../app/home/home.component";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(query: string,page:number){
    return this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/search?q="+query+"&page="+page)
  }
  searchHelper(query: string){
    return this.http.get<string[]>(environment.backendUrl+"/unAuth/search/helper?q="+query);
  }


}
