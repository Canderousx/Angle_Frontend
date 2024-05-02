import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient, HttpEventType, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../app.component";
import {NgFor, NgIf, NgStyle} from "@angular/common";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {fadeInOut} from "../../shared/animations/fadeInOut";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {filter, map, tap} from "rxjs";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
import {Router, RouterOutlet} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-upload',
  standalone: true,
  animations: [fadeInOut],
  imports: [
    NgIf,
    NgFor,
    MaterialModule,
    NgStyle,
    MouseEnterDirective,
    MatProgressSpinner,
    RouterOutlet
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  selectedFile?: File;
  generatedId = "";
  videoLoaded = false;
  thumbnails: string[] = [];
  progress = 0;
  uploading = false;
  @ViewChild('uploadBtn', { static: false }) uploadBtn!: ElementRef<HTMLButtonElement>;

  constructor(private http: HttpClient,
              private global: GlobalMessengerService,
              private router: Router) { }

  uploadVideo(event: Event) {
    event.preventDefault();
    this.generatedId = "";
    this.videoLoaded = false;
    if (this.selectedFile) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post<serverResponse>(`${environment.backendUrl}/auth/upload`, formData,{observe: 'events', reportProgress: true})
        .pipe(
          tap(event =>{
            if (event.type === HttpEventType.UploadProgress){
              if(event.total){
                this.progress = Math.round(100 * event.loaded / event.total);
              }
            }
          }),
          filter((event): event is HttpResponse<serverResponse> => event.type === HttpEventType.Response),
          map(event => event.body)
        )
        .subscribe({
        next: (response) => {
          if(response){
            this.generatedId = response.message
            this.global.toastMessage.next(["alert-success","The video has been processed successfully!"])
            this.uploading = false;
            this.router.navigate(['/upload/metadata'],{queryParams: {v: this.generatedId}})

          }
        }
        ,
        error: (error) =>{
          console.log(error);
          if(error.status !== 403){
            this.global.toastMessage.next(["alert-warning","There was an error during the upload: "+error.error])
          }
        }
      });
    }
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      if(!input.files[0].type.startsWith("video/")){
        this.global.toastMessage.next(['alert-warning','Selected files type is not supported!'])
        return;
      }
      this.selectedFile = input.files[0];
      this.uploadBtn.nativeElement.click();
    }
  }

  getThumbnails(){
    this.thumbnails = [];
    this.http.get<string[]>(environment.backendUrl+"/auth/upload/getThumbnails?v="+this.generatedId)
      .subscribe({
        next: value => {
          this.thumbnails = value;
          this.videoLoaded = true;
          },
        error: err => {
          this.global.toastMessage.next(["alert-warning","There was an error during thumbnails processing..."])
          this.generatedId = ''}
      })
  }


}
