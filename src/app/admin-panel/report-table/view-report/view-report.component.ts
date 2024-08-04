import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Report} from "../../../../shared/models/report";
import {SimpleDatePipe} from "../../../../shared/pipes/simple-date.pipe";
import {accountRes} from "../../../../shared/services/authentication.service";
import {videoObj} from "../../../home/home.component";
import {Comment} from "../../../../shared/models/comment";
import {environment} from "../../../../environments/environment.development";
import {MouseEnterDirective} from "../../../../shared/directives/mouse-enter.directive";
import {Route, Router, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {Base64ImagePipe} from "../../../../shared/pipes/base64-image.pipe";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NextLinerPipe} from "../../../../shared/pipes/next-liner.pipe";
import {MatTooltip} from "@angular/material/tooltip";
import {RowcutPipe} from "../../../../shared/pipes/rowcut.pipe";
import {MatDivider} from "@angular/material/divider";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../../shared/modules/material/material.module";
import {serverResponse} from "../../../app.component";
import {GlobalMessengerService} from "../../../../shared/services/global-messenger.service";

@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [
    SimpleDatePipe,
    MouseEnterDirective,
    RouterLink,
    NgIf,
    Base64ImagePipe,
    DateFormatPipe,
    NextLinerPipe,
    MaterialModule,
    RowcutPipe,
    MatDivider,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent implements OnInit{

  constructor(private http: HttpClient,
              private global: GlobalMessengerService,
              private router: Router) {
  }

  @Input()report!: Report;
  reporter!: accountRes;
  reported!: accountRes;
  reportedVideo!: videoObj;
  reportedComment!: Comment;
  maxLength = 35;
  rowLength = 120;
  toggleSolve = false;

  solveForm = new FormGroup({
    reason: new FormControl("", [Validators.required]),
  })

  toggleSolvePanel(){
    this.toggleSolve = !this.toggleSolve;
  }

  banMedia(){
    let url = '';
    if(this.report.type ==='VIDEO'){
      url = "banVideo?videoId="+this.report.mediaId;
    }
    if(this.report.type ==="COMMENT"){
      url = "banComment?commentId="+this.report.mediaId;
    }
    this.http.post<serverResponse>(environment.backendUrl+"/"+url+"&reportId="
      +this.report.id,this.solveForm.controls.reason.value)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(['alert-primary',value.message])
          this.router.navigate(['/admin'])
        },
        error: err => {
          this.global.toastMessage.next(['alert-danger',err.error])
        }
      })

  }

  banAccount(){
    this.http.post<serverResponse>(environment.backendUrl+"/banAccount"+"?accountId="+this.reported.id+"&reportId="+this.report.id,
      this.solveForm.controls.reason.value)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(['alert-primary',value.message])
          this.router.navigate(['/admin'])
        },
        error: err => {
          this.global.toastMessage.next(['alert-danger',err.error])
        }
      })


  }

  cancelReport(){
    this.http.post<serverResponse>(environment.backendUrl+"/cancelReport?"+"reportId="+this.report.id,
      this.solveForm.controls.reason.value)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(['alert-primary',value.message])
          this.router.navigate(['/admin'])
        },
        error: err => {
          this.global.toastMessage.next(['alert-danger',err.error])
        }
      })


  }

  solveReport(submitter: string){
    if(submitter === 'media'){
      this.banMedia()
    }
    if(submitter === 'account'){
      this.banAccount();
    }
    if(submitter === 'cancel'){
      this.cancelReport();
    }
  }

  resizeComment(comment: Comment){
    comment.extended = !comment.extended;
  }

  shortenComment(comment: Comment){
    if(!comment.extended){
      return comment.content.slice(0,this.rowLength);
    }
    return comment.content;
  }

  ngOnInit() {
    console.log("REPORT ID: "+this.report.id)
    console.log("REPORTER: "+this.report.reporter)
    console.log("MEDIA TYPE: "+this.report.type)
    console.log("MEDIA ID: "+this.report.mediaId);
    this.http.get<accountRes[]>(environment.backendUrl+"/report/getUsersInvolved?id="+this.report.id)
      .subscribe({
        next: value => {
          this.reporter = value[0];
          this.reported = value[1];
        }
      })

    if(this.report.type === 'VIDEO'){
      this.http.get<videoObj>(environment.backendUrl+"/unAuth/videos/getVideo?id="+this.report.mediaId)
        .subscribe({
          next: value => {
            this.reportedVideo = value;
          }
        })
    }
    if(this.report.type === 'COMMENT'){
      this.http.get<Comment>(environment.backendUrl+"/comments/getComment?id="+this.report.mediaId)
        .subscribe({
          next: value => {
            this.reportedComment = value;
          }
        })
    }
  }

}
