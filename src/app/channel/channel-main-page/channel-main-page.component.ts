import {Component, Input} from '@angular/core';
import {accountRes} from "../../../shared/services/authentication.service";

@Component({
  selector: 'app-channel-main-page',
  standalone: true,
  imports: [],
  templateUrl: './channel-main-page.component.html',
  styleUrl: './channel-main-page.component.css'
})
export class ChannelMainPageComponent {

  @Input() channelAccount!: accountRes;



}
