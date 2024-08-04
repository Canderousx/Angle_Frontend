import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {serverResponse} from "../../app/app.component";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  confirmEmail(token: string){
    return this.http.post<serverResponse>(environment.backendUrl+"/unAuth/signup/confirmAccount?token="+token,{})
  }
}
