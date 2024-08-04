import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {authRes} from "../../app/sign-in/sign-in.component";
import {GlobalMessengerService} from "./global-messenger.service";


export interface accountRes{
  id: string,
  username: string,
  email: string,
  subscribers: number,
  avatar: string,
  subscribed?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedUser!: accountRes;
  currentUser: BehaviorSubject<accountRes> = new BehaviorSubject(this.loggedUser)

  constructor(private http: HttpClient,
              private router: Router,
              private global: GlobalMessengerService) {

  }

  authenticate(credentials: {email: string, password: string}){
    return this.http.post<authRes>(environment.backendUrl+"/unAuth/login",credentials)
  }

  logout(){
    if(!!localStorage.getItem("authToken")){
      let token = localStorage.getItem("authToken");
      this.http.post<serverResponse>(environment.backendUrl+"/logout",token)
      localStorage.removeItem("authToken");
      this.global.toastMessage.next(["alert-primary","You've been signed out"])
      this.loggedUser = {
        id: '',
        username: '',
        email: '',
        subscribers: 0,
        avatar: '',
      };

      this.currentUser.next(this.loggedUser);
      this.loggedIn.next(false);
    }

  }

  getUserId(){
    return this.http.get<serverResponse>(environment.backendUrl+"/getMyId");
  }
  getCurrentUser(){
    this.http.get<accountRes>(environment.backendUrl+"/getCurrentUser")
      .subscribe({
        next: value => {
          this.currentUser.next(value);
        }
      });

  }

  getUser(id: string){
    return this.http.get<accountRes>(environment.backendUrl+"/unAuth/videos/getUserById?id="+id)
  }


}
