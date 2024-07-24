import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {serverResponse} from "../app.component";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit{

  constructor(private http: HttpClient,
              private global: GlobalMessengerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,) {
  }

  sub!: Subscription;
  token!: string;

  confirmEmail(){
    this.http.post<serverResponse>(environment.backendUrl+"/unAuth/signup/confirmAccount?token="+this.token,{})
      .subscribe({
        next: value => {
          this.global.toastMessage.next(["alert-primary",value.message]);
          this.router.navigate(["/signin"]);
        },
        error: err => {
          let msg: serverResponse = err.error;
          this.global.toastMessage.next(["alert-danger",msg.message]);
          this.router.navigate(["/"]);
        }
      })
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: value => {
        this.token = value['id'];
        this.confirmEmail();

      }
    })

  }

}
