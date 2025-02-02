import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {serverResponse} from "../../app/app.component";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AvatarChangerService {

  constructor(private http: HttpClient) { }

  changeAvatar(userId: string, formData: FormData){
    return this.http.post<serverResponse>(environment.backendUrl+"/changeAvatar?id="+userId,formData)
  }
}
