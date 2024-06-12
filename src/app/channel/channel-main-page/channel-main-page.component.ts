import {Component, Input} from '@angular/core';
import {accountRes} from "../../../shared/services/authentication.service";
import {Base64ImagePipe} from "../../../shared/pipes/base64-image.pipe";

@Component({
  selector: 'app-channel-main-page',
  standalone: true,
  imports: [
    Base64ImagePipe
  ],
  templateUrl: './channel-main-page.component.html',
  styleUrl: './channel-main-page.component.css'
})
export class ChannelMainPageComponent {

  @Input() channelAccount!: accountRes;



}
