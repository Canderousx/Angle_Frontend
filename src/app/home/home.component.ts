import {Component, OnInit} from '@angular/core';
import {tag, videoDetails} from "../upload-metadata/upload-metadata.component";
import {HttpClient} from "@angular/common/http";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {environment} from "../../environments/environment.development";
import {NgForOf, NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {Router, RouterLink} from "@angular/router";
import {FeedComponent} from "../../shared/components/feed/feed.component";

export interface videoObj{
  id: string,
  name: string,
  datePublished: Date,
  tags: tag[],
  description: string,
  views: string,
  likes: string,
  dislikes: string,
  authorId: string,
  hlsPath: string,
  thumbnail: string,
  isBanned: boolean,
  authorAvatar: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    Base64ImagePipe,
    RouterLink,
    FeedComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private http: HttpClient,
              private global: GlobalMessengerService,
              private router: Router) {
  }

  latestVideos: videoObj[] = [];
  recommendedVideos: videoObj[] = [];
  pageNum = 0;
  loggedIn!: boolean;





  ngOnInit() {
    this.loggedIn = !!sessionStorage.getItem("authToken");
    this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getAll?page="+this.pageNum)
      .subscribe({
        next: value => {
          this.latestVideos = value;
          console.log("Videos received: "+this.latestVideos.length)
        },
        error: err => {
          console.log(err.error)
          this.global.toastMessage.next(["alert-warning","Internal Server Error. Please try again later"])
        }
      })

  }

}
