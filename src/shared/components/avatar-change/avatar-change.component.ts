import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import {MaterialModule} from "../../modules/material/material.module";
import {HttpClient} from "@angular/common/http";
import {GlobalMessengerService} from "../../services/global-messenger.service";
import {environment} from "../../../environments/environment.development";
import {serverResponse} from "../../../app/app.component";

@Component({
  selector: 'app-avatar-change',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './avatar-change.component.html',
  styleUrl: './avatar-change.component.css'
})
export class AvatarChangeComponent {

  @Input() userId!: string;
  @Output() close = new EventEmitter<any>;
  selectedFile!: File;

  constructor(private http: HttpClient,
              private global: GlobalMessengerService) {
  }

  closeSettings(){
    this.close.emit();
  }

  handleInput(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files){
      if(input.files[0].type.startsWith("image/")){
        this.selectedFile = input.files[0];
        console.log("Selected file: "+this.selectedFile.name)
        this.uploadAvatar();
      }else{
        this.global.toastMessage.next(["alert-warning","Selected file's type is not supported!"])
      }

    }

  }

  uploadAvatar(){
    const formData = new FormData();
    formData.append('file',this.selectedFile,this.selectedFile.name)
    this.http.post<serverResponse>(environment.backendUrl+"/auth/changeAvatar?id="+this.userId,formData)
      .subscribe({
        next: value => {
          this.global.toastMessage.next(["alert-primary","Avatar has been changed"])
          this.closeSettings();
        },
        error: err => {
          let msg: serverResponse = err.error;
          this.global.toastMessage.next(["alert-warning",msg.message])
        }
      })

  }

}
