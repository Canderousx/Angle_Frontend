import {Component, HostListener, OnInit} from '@angular/core';
import {tag, videoDetails} from "../upload-metadata/upload-metadata.component";
import {HttpClient} from "@angular/common/http";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {environment} from "../../environments/environment.development";
import {NgForOf, NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {Router, RouterLink} from "@angular/router";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {MatDivider} from "@angular/material/divider";
import {Title} from "@angular/platform-browser";

export interface videoObj{
  id: string,
  name: string,
  datePublished: Date,
  tags: tag[],
  description: string,
  views: number,
  likes: number,
  dislikes: number,
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
    FeedComponent,
    MatDivider
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private http: HttpClient,
              private global: GlobalMessengerService,
              private router: Router,
              private titleService: Title) {
  }

  latestVideos: videoObj[] = [];
  mostPopular: videoObj[] = [];
  loaded = false;
  fromSubsVideos: videoObj[] = [];
  pageNum = 0;
  subPageNum = 0;
  loggedIn!: boolean;

  loadLatest(){
    this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getAll?page="+this.pageNum)
      .subscribe({
        next: value => {
          this.latestVideos = this.latestVideos.concat(value);
          console.log("Videos received: "+this.latestVideos.length)
          this.loaded = true;
        },
        error: err => {
          console.log(err.error)
          this.global.toastMessage.next(["alert-warning","Internal Server Error. Please try again later"])
        }
      })
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.pageNum+=1;

      this.loadLatest();
    }
  }




  ngOnInit() {
    this.loggedIn = !!localStorage.getItem("authToken");
    this.loaded = false;
    this.titleService.setTitle("Angle")


    this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getMostPopular")
      .subscribe({
        next: value => {
          console.log("Popular received: "+value.length)
          this.mostPopular = value;
        }
      })

    this.loadLatest();

    this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getBySubscribers?page="+this.subPageNum)
      .subscribe({
        next: value => {
          console.log("Subs videos received: "+value.length)
          this.fromSubsVideos = value;
        }
      })

  }

}
