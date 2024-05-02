import {Component, OnInit} from '@angular/core';
import {VideoPlayerComponent} from "../video-player/video-player.component";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {videoObj} from "../home/home.component";
import {NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {accountRes} from "../../shared/services/authentication.service";

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    VideoPlayerComponent,
    NgIf,
    Base64ImagePipe,
    RouterLink
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.css'
})
export class WatchComponent implements OnInit{
  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }
  videoSub!: Subscription;
  videoId: string = "";
  videoURL: string = "";
  video!: videoObj;
  author!: accountRes;


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
          this.getAuthor();
        },
        error: err => {
          console.log(err.error);
        }
      })
  }

  getAuthor(){
    this.http.get<accountRes>(environment.backendUrl+"/unAuth/videos/getAccount?id="+this.video.authorId)
      .subscribe({
        next: value => {
          this.author = value;
        },
        error: err => {
          console.log(err.error);
        }
      })
  }


  ngOnInit() {
    this.videoSub = this.activatedRoute.queryParams.subscribe({
        next: value => {
          this.videoId = value['v'];
          this.setVideoUrl();
          this.getVideoObj();
          console.log("VIDEO ID: "+this.videoId)
        }
      }
    )
  }

}
