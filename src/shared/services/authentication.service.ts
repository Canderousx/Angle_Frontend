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
  subscribedIds: string[]
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
    sessionStorage.removeItem("authToken");
    this.global.toastMessage.next(["alert-primary","You've been signed out"])
    this.loggedUser = {
      id: '',
      username: '',
      email: '',
      subscribers: 0,
      subscribedIds: []
    };
    this.currentUser.next(this.loggedUser);
    this.loggedIn.next(false);
  }

  getUserId(){
    return this.http.get<serverResponse>(environment.backendUrl+"/auth/getMyId");
  }
  getCurrentUser(){
    this.http.get<accountRes>(environment.backendUrl+"/auth/getCurrentUser")
      .subscribe({
        next: value => {
          this.loggedUser = value;
          this.currentUser.next(this.loggedUser);
        }
      });
  }

  getUser(id: string){
    return this.http.get<accountRes>(environment.backendUrl+"/auth/getUserById?id="+id)
  }


}
