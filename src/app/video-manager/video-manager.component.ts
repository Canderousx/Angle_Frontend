import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../shared/modules/material/material.module";
import {videoObj} from "../home/home.component";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {accountRes, AuthenticationService} from "../../shared/services/authentication.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {environment} from "../../environments/environment.development";
import {Base64ImagePipe} from "../../shared/pipes/base64-image.pipe";
import {SimpleDatePipe} from "../../shared/pipes/simple-date.pipe";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
import {serverResponse} from "../app.component";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-video-manager',
  standalone: true,
  imports: [MaterialModule, NgIf, NgForOf, Base64ImagePipe, SimpleDatePipe, MouseEnterDirective, RouterLink],
  templateUrl: './video-manager.component.html',
  styleUrl: './video-manager.component.css'
})
export class VideoManagerComponent implements OnInit{

  accountVideos!: videoObj[];
  currentUser!: accountRes;
  paramId!: string;
  totalVideos = 0;
  page = 0;

  constructor(private http: HttpClient,
              private auth: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private global: GlobalMessengerService,
              private titleService: Title) {
  }


  ngOnInit() {
    this.titleService.setTitle("Videos Manager")
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
      this.loadVideos();
    })
  }

  deleteVideo(id: string){
    this.http.delete<serverResponse>(environment.backendUrl+"/auth/deleteVideo?id="+id).subscribe({
      next: value => {
        this.loadVideos();
        this.global.toastMessage.next(["alert-primary",value.message])

      },
      error: err => {
        let errMsg: serverResponse = err.error;
        this.global.toastMessage.next(["alert-warning",errMsg.message])
      }
    })
  }

  editVideo(id: string){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['upload/metadata'], { queryParams: { v: id, existing: true } })
    );
    window.open(url,"_blank");
  }

  loadVideos(){
    this.accountVideos = [];
    if(!this.currentUser){
      this.router.navigate(['signin'])
    }
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        this.paramId = params['id'];
        if(this.paramId === this.currentUser.id){
          this.http.get<videoObj[]>(environment.backendUrl+"/unAuth/videos/getUserVideos?id="+this.paramId+"&page="+this.page,{observe:"response"})
            .subscribe({
              next: value => {
                if(value.headers.get("totalVideos")){
                  const totalVideos = value.headers.get("totalVideos");
                  if(totalVideos){
                    this.totalVideos = +totalVideos;
                  }
                }
                if(value.body){
                  this.accountVideos = value.body;
                }
              }
            })
        }
      },
    })

  }

}
