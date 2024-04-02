import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../shared/components/header/header.component";
import {FooterComponent} from "../shared/components/footer/footer.component";
import {BehaviorSubject} from "rxjs";
import {AlertComponent} from "../shared/components/alert/alert.component";
import {NgIf} from "@angular/common";
import {GlobalMessengerService} from "../shared/services/global-messenger.service";
import {fadeInOut} from "../shared/animations/fadeInOut";


export interface serverResponse{
  message: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  animations: [fadeInOut],
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AlertComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private global: GlobalMessengerService) {
  }
  title = 'Angle';
  loggedIn = new BehaviorSubject(false);
  alert: string[] = [];

  ngOnInit() {
    this.global.toastMessage.subscribe({
      next: value => {
        this.alert = value;
        setTimeout(() =>{
          this.alert = [];
        }, 2500)
      }
    })

  }


}
