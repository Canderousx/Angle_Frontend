import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {accountRes, AuthenticationService} from "../../shared/services/authentication.service";
import {Subscription} from "rxjs";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {ChannelMainPageComponent} from "./channel-main-page/channel-main-page.component";
import {ChannelVideosComponent} from "./channel-videos/channel-videos.component";
import {ChannelMiscComponent} from "./channel-misc/channel-misc.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [MaterialModule, ChannelMainPageComponent, ChannelVideosComponent, ChannelMiscComponent, NgIf],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit, OnDestroy{

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private auth: AuthenticationService) {
  }
  currentUser!: accountRes
  channelUser!: accountRes
  channelId!: string;
  sub!: Subscription;
  querySub!: Subscription;
  ownChannel = false;

  ngOnInit() {
    this.auth.getCurrentUser();
    this.sub = this.auth.currentUser.subscribe({
      next: value => {
        if(value){
          this.currentUser = value;
          console.log("Current User: "+value.username+" ID: "+value.id)
          this.querySub = this.activatedRoute.queryParams.subscribe(params =>{
            this.channelId = params['id'];
            console.log("Channel ID: "+this.channelId);
          })
          if(this.channelId === this.currentUser.id){
            this.ownChannel = true;
            this.channelUser = this.currentUser;
          }else{
            this.auth.getUser(this.channelId)
              .subscribe({
                next: value =>{
                  if(value){
                    console.log("Channel belongs to: "+this.channelUser)
                    this.channelUser = value;
                  }
                }
              })
          }
          console.log("Own channel?: "+this.ownChannel);
        }
      }
    })

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.querySub.unsubscribe();
  }


}
