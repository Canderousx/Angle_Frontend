import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {accountRes, AuthenticationService} from "../../shared/services/authentication.service";
import {Subscription} from "rxjs";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {ChannelMainPageComponent} from "./channel-main-page/channel-main-page.component";
import {ChannelVideosComponent} from "./channel-videos/channel-videos.component";
import {ChannelMiscComponent} from "./channel-misc/channel-misc.component";
import {NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {videoObj} from "../home/home.component";
import {environment} from "../../environments/environment.development";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [MaterialModule, ChannelMainPageComponent, ChannelVideosComponent, ChannelMiscComponent, NgIf, Base64ImagePipe, FeedComponent, RouterLink],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit, OnDestroy{

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private auth: AuthenticationService,
              private router: Router,
              private titleService: Title) {
  }
  currentUser!: accountRes
  channelUser!: accountRes
  channelId!: string;
  channelVideos!: videoObj[];
  sub!: Subscription;
  querySub!: Subscription;
  page = 0;
  totalVideos = 0;
  ownChannel = false;

  ngOnInit() {
    this.querySub = this.activatedRoute.queryParams.subscribe(params =>{
      this.channelId = params['id'];
      console.log("Channel ID: "+this.channelId);
      this.auth.getUser(this.channelId)
        .subscribe({
          next: value =>{
            if(value){
              this.channelUser = value;
              console.log("Channel belongs to: "+this.channelUser.username);
              this.titleService.setTitle(this.channelUser.username)
              this.loadVideos();
            }
          }
        })
    })
    this.auth.getCurrentUser();
    this.sub = this.auth.currentUser.subscribe({
      next: value => {
        if(value){
          this.currentUser = value;
          console.log("Current User: "+value.username+" ID: "+value.id)
          if(this.channelId === this.currentUser.id){
            this.ownChannel = true;
            this.channelUser = this.currentUser;
          }else{
          }
          console.log("Own channel?: "+this.ownChannel);
        }
      }
    })

  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
    if(this.querySub){
      this.querySub.unsubscribe();
    }
  }

  loadVideos(){
    this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getUserVideos?id="+this.channelId+"&page="+this.page,{observe:"response"})
      .subscribe({
        next: value => {
          if(value.headers.get("totalVideos")){
            const totalVideos = value.headers.get("totalVideos");
            if(totalVideos){
              this.totalVideos = +totalVideos;
            }
          }
          if(value.body){
            this.channelVideos = value.body;
          }
        }
      })
  }

  videosManager(){
    this.router.navigate(["manager"],{queryParams:{id:this.channelId}})
  }


}
