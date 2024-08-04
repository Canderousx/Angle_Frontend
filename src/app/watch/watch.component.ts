import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoPlayerComponent} from "../video-player/video-player.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {videoObj} from "../home/home.component";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {accountRes, AuthenticationService} from "../../shared/services/authentication.service";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
import {CommentsComponent} from "../../shared/components/comments/comments.component";
import {DateFormatPipe} from "../../shared/pipes/date-format.pipe";
import {SimpleDatePipe} from "../../shared/pipes/simple-date.pipe";
import {serverResponse} from "../app.component";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {NextLinerPipe} from "../../shared/pipes/next-liner.pipe";
import {Title} from "@angular/platform-browser";
import {SubscribeService} from "../../shared/services/subscribe.service";

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    VideoPlayerComponent,
    NgIf,
    Base64ImagePipe,
    RouterLink,
    MaterialModule,
    MouseEnterDirective,
    CommentsComponent,
    DateFormatPipe,
    DatePipe,
    SimpleDatePipe,
    NgClass,
    FeedComponent,
    NextLinerPipe,
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.css'
})
export class WatchComponent implements OnInit, OnDestroy{
  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private auth: AuthenticationService,
              private router: Router,
              private titleService: Title,
              private subscribeService: SubscribeService,) {
  }
  videoSub!: Subscription;
  videoId: string = "";
  videoURL: string = "";
  video!: videoObj;
  similarVideos!: videoObj[];
  author!: accountRes;
  rated = false;
  rating!: boolean;
  descClass = "short"
  descMaxLength = 80;
  sub!: Subscription;
  subSub!: Subscription;
  currentUser!: accountRes;
  hover = false;


  onMouseEnter(){
    this.hover = true;
  }

  onMouseLeave(){
    this.hover = false;
  }


  expandDescription(){
    this.descClass = "expanded"
  }

  shortDescription(){
    this.descClass = "short";
  }

  getShorterDescription(desc: string){
    if(desc.includes("\n")){
      return desc.slice(0,desc.indexOf("\n"))
    }
    return desc.slice(0,this.descMaxLength);
  }

  videosManager(){
    this.router.navigate(["manager"],{queryParams:{id:this.currentUser.id}})
  }

  editVideo(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['upload/metadata'], { queryParams: { v: this.video.id, existing: true } })
    );
    window.open(url,"_blank");
  }


  checkIfRated(){
    this.rated = false;
    if(!!localStorage.getItem("authToken")){
      this.http.get<boolean[]>(environment.backendUrl+"/checkRated?v="+this.videoId)
        .subscribe({
          next: value => {
            if(value.length > 0){
              this.rated = true;
              this.rating = value[0];
              console.log("RATED: "+this.rated);
              console.log("RATING: "+this.rating);
            }
          }
        })
    }

  }


  setVideoUrl(){
    this.videoURL = environment.backendUrl+"/media/hls/"+this.videoId+"/"+this.videoId+"_playlist.m3u8";
  }

  authorPage(){
    this.router.navigate(["/channel"],{queryParams: {id: this.author.id}})
  }

  getVideoObj(){
    this.http.get<videoObj>(environment.backendUrl+"/unAuth/videos/getVideo?id="+this.videoId)
      .subscribe({
        next: value => {
          this.video = value;
          this.titleService.setTitle(this.video.name)
          this.getAuthor();
        },
        error: err => {
          console.log(err.error);
        }
      })
  }

  getAuthor(){
    this.http.get<accountRes>(environment.backendUrl+"/unAuth/getAccount?id="+this.video.authorId)
      .subscribe({
        next: value => {
          this.author = value;
          if(!!localStorage.getItem("authToken")){
            this.subscribeService.isSubscriber(this.author.id)
              .subscribe({
                next: value =>{
                  this.author.subscribed = value;
                },
                error: err => {
                  this.author.subscribed = false;
                }
              })
          }
        },
        error: err => {
          console.log(err.error);
        }
      })
  }

  registerView(){
    this.http.patch<serverResponse>(environment.backendUrl+"/unAuth/videos/registerView?id="+this.video.id,{})
      .subscribe({
        next: value => {
          this.video.views+=1;
        }
      })
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      credentials: 'include',
    });
  }

  rateVideo(rate: boolean){
      this.http.post(environment.backendUrl+"/rateVideo?v="+this.videoId,rate)
        .subscribe({
          next: value => {
            if(rate){
              this.video.likes = this.video.likes + 1;
              if(this.rated){
                this.video.dislikes = this.video.dislikes - 1;
              }
            }
            if(!rate){
              this.video.dislikes = this.video.dislikes + 1;
              if(this.rated){
                this.video.likes = this.video.likes - 1;
              }
            }
            this.rating = rate;
            this.rated = true;
          }
        })
  }

  report(){
    this.router.navigate(["/report"],{queryParams:{id: this.videoId,type:"video",src: this.router.url}})
  }
  ngOnInit() {
    this.videoSub = this.activatedRoute.queryParams.subscribe({
        next: value => {
          this.videoURL = "";
          this.videoId = value['v'];
          this.setVideoUrl();
          this.getVideoObj();
          console.log("VIDEO ID: "+this.videoId)
          this.checkIfRated();
          this.getSimilarVideos();
          this.auth.getCurrentUser();
          this.sub = this.auth.currentUser.subscribe({
            next: value =>{
              this.currentUser = value;
            }
          })
          this.subSub = this.subscribeService.subscribed.subscribe({
            next: value => {
              this.author.subscribed = value;
            }
          })
          setTimeout(() =>{this.registerView()}, 30000)
        }
      }
    )
  }

  subscribe(action: boolean){
    if(action){
      this.subscribeService.subscribe(this.author.id);
      this.author.subscribers+=1;
      return;
    }
    this.hover = false;
    this.subscribeService.unsubscribe(this.author.id);
    this.author.subscribers-=1;
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
    if(this.subSub){
      this.subSub.unsubscribe();
    }

  }

  getSimilarVideos(){
    this.similarVideos = [];
    this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getSimilar?id="+this.videoId)
      .subscribe({
        next: value => {
          this.similarVideos = value;
        }
      })
  }




}
