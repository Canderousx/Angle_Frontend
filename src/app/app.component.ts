import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../shared/components/header/header.component";
import {FooterComponent} from "../shared/components/footer/footer.component";
import {BehaviorSubject} from "rxjs";
import {AlertComponent} from "../shared/components/alert/alert.component";
import {NgIf} from "@angular/common";
import {GlobalMessengerService} from "../shared/services/global-messenger.service";
import {fadeInOut} from "../shared/animations/fadeInOut";
import {AuthenticationService} from "../shared/services/authentication.service";
import {ModalComponent} from "../shared/components/modal/modal.component";


export interface serverResponse{
  message: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  animations: [fadeInOut],
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AlertComponent, NgIf, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private global: GlobalMessengerService,
              private auth: AuthenticationService) {
  }
  loggedIn = false;
  title = 'Angle - Between the Thoughts!';
  alert: string[] = [];

  checkAuth(){
    if(localStorage.getItem("authToken")){
      this.auth.loggedIn.next(true);
    }
  }

  ngOnInit() {
    this.checkAuth();
    this.auth.loggedIn.subscribe({
      next: value => {
        this.loggedIn = value;
      }
    })
    this.global.toastMessage.subscribe({
      next: value => {
        this.alert = value;
        setTimeout(() =>{
          this.alert = [];
        }, 5500)
      }
    })

  }


}
