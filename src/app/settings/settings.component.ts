import {Component, OnInit} from '@angular/core';
import {accountRes, AuthenticationService} from "../../shared/services/authentication.service";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {Router} from "@angular/router";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {AvatarChangerService} from "../../shared/services/avatar-changer.service";
import {AvatarChangeComponent} from "../../shared/components/avatar-change/avatar-change.component";
import {NgIf} from "@angular/common";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    Base64ImagePipe,
    MaterialModule,
    AvatarChangeComponent,
    NgIf
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{

  constructor(private authService: AuthenticationService,
              private global: GlobalMessengerService,
              private avatarChanger: AvatarChangerService,
              private router: Router,
              private titleService: Title,) {
  }

  user!: accountRes;
  avatarChange = false;

  ngOnInit() {
    this.refresh();
  }
  refresh(){
    this.titleService.setTitle("Account Settings")
    this.authService.getCurrentUser();
    this.authService.currentUser.subscribe({
      next: value => {
        this.user = value;
      }    })
  }

  toggleChanger(){
    this.avatarChange = !this.avatarChange;
    console.log("changer toggled!: "+this.avatarChange)
  }
  closeChanger(event: any){
    this.avatarChange = false;
    this.refresh();

  }




}
