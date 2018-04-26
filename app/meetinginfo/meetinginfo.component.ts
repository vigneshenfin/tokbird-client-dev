import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface MeetinginfoModel {
  title:string;
  agenda:string;
  scheduledDate:string;
  durationHours:string;
  durationMinutes:string;
  timezone:string;
  presentersUrl:string;
  expertsUrl:string;
  attendeesUrl:string;
  reminders: any[];
}

@Component({
  selector: 'app-meetinginfo',
  templateUrl: './meetinginfo.component.html',
  styleUrls: ['./meetinginfo.component.css']
})
// export class MeetinginfoComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   } 

// }
export class MeetinginfoComponent extends DialogComponent<MeetinginfoModel, boolean> implements MeetinginfoModel {
  public title: string;
  public agenda: string;
  public scheduledDate: string;
  public durationHours: string;
  public durationMinutes: string;
  public timezone: string;
  public presentersUrl: string;
  public expertsUrl: string;
  public attendeesUrl: string;
  public reminders: any[];
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  confirm() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
}
