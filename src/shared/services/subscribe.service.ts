import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  subscribed: Subject<boolean> = new Subject();

  isSubscriber(id: string){
    return this.http.get<boolean>(environment.backendUrl+"/auth/isSubscriber?id="+id)
  }


  subscribe(id: string){
    this.http.get<serverResponse>(environment.backendUrl+"/auth/subscribe?id="+id)
      .subscribe({
        next: value => {
          this.subscribed.next(true);
        },
        error: err => {
          console.log("Error subscribing");
          this.router.navigate(["signin"])
        }
      })

  }

  unsubscribe(id: string){
    this.http.get<serverResponse>(environment.backendUrl+"/auth/unsubscribe?id="+id)
      .subscribe({
        next: value => {
          this.subscribed.next(false);
        }
      })
  }


}
