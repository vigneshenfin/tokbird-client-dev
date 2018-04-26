import { Component, OnInit ,Input} from '@angular/core';
import { ReportsService } from 'app/reports/reports.service';
import { User } from "app/shared/user";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';
@Component({
  selector: 'app-are-you-there',
  templateUrl: './are-you-there.component.html',
  styleUrls: ['./are-you-there.component.css'],
  providers: [ReportsService]
})
export class AreYouThereComponent implements OnInit {

  @Input() routeMeetingId;
  @Input() meetingId;
  @Input() isAccessEnabled;

  public attendanceHeaders:any = [];
  public areYouThereDetails:any = [];
  public areYouThereRecordDetails:any = [];
  public areYouThereSearchParamsDetails:any = {};
  p: number = 1;
  public attendanceLimit = 10;
  public attendanceOffset = 1;
  public userDetails:any = [];
  public areYouThereRecords:any = [];
  areYouThereBusy: Subscription;

  public rYouThereDetails:any = [];
  public rYouThereRecords:any = [];
  public rYouThereRecordDetails:any = [];
  public rYouThereBusy: Subscription;
  public rYouThereOffset = 1;
  public rYouThereLimit = 10;

  constructor(private user:User, private reportsService:ReportsService, private router:Router) { 
    this.userDetails   = user.getUser();
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.p = 1;
    if(this.isAccessEnabled){
      // this.getAreYouThere();
      this.getRYouThere();
    }
  }

  pageChanged(event) {
    this.attendanceOffset = event;
    // this.getAreYouThere();
    this.getRYouThere();
  }

  getAreYouThere() {
    let params:any      = {};
    params.token        = this.userDetails.token;
    params.limit        = this.attendanceLimit;
    params.offset       = this.attendanceOffset;
    params.meeting_ids  = this.meetingId;
   
    // Added - 17/11/2017
    params.route_meeting_id = this.routeMeetingId;
    // this.attendanceBusy = this.reportsService.attendance(params).subscribe(
    this.areYouThereBusy = this.reportsService.areYouThere(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.p = this.attendanceOffset;
          this.areYouThereDetails = [];
          this.attendanceHeaders = [];
          let attendance:any = [];
          attendance = response.body.attendance;
          let attendancesHeaders:any = {};
          let fieldDetails:any = [];
          let headerDetails:any = [];
          let attendeeDetails:any = [];
          if(attendance != ''){
            for(let i = 0; i < attendance.length; i++){
              let details = JSON.parse(attendance[i].details);
              let field:any = {};
              for(let i = 0; i < details.length; i++){
                let header:any = {};
                attendancesHeaders[details[i].field] = details[i].label;
                field[details[i].field] = details[i].value;
                header.field = details[i].field;
                header.label = details[i].label;
                headerDetails.push(header);
              }
              fieldDetails.push(field);
              attendeeDetails.push(details);
            }
          }
          this.areYouThereDetails = fieldDetails;
          var obj = {};
          for ( let i=0, len=headerDetails.length; i < len; i++ )
              obj[headerDetails[i]['field']] = headerDetails[i];
          headerDetails = new Array();
          for ( let key in obj )
              headerDetails.push(obj[key]);
          this.attendanceHeaders = headerDetails;
          let attendancesList:any = [];
          for(let i=0; i<attendeeDetails.length; i++){
            let sField:any = [];
            for(let k=0; k< headerDetails.length; k++){
              sField[k] = "";
              for(let j=0; j<attendeeDetails[i].length; j++){
                if(attendeeDetails[i][j].field == headerDetails[k].field){
                  sField[k] = attendeeDetails[i][j].value;
                }
              }
            }
            attendancesList.push(sField);
          }
          this.areYouThereDetails = attendancesList;
          this.areYouThereRecords = response.body.records;
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  getRYouThere(){
    let params:any = {};
    params.token = this.userDetails.token;
    params.limit = this.attendanceLimit;
    params.offset = this.attendanceOffset;
    // params.meeting_ids = [];
    // params.meeting_ids.push(this.meetingId);
    params.meeting_ids = this.meetingId;
    params.route_meeting_id = this.routeMeetingId;
    this.rYouThereBusy = this.reportsService.areYouThere(params).subscribe(
      (response:any) => {
        // console.log('enter');
        response   = JSON.parse(response['_body']);
        this.rYouThereDetails = [];
        if(response.success == 1){
          this.p = this.rYouThereOffset;
          let rYouThere = response.body.attendance;
          for(let i=0; i<rYouThere.length; i++){
            let rYouThereDetail:any   = {};
            rYouThereDetail.firstName = '';
            rYouThereDetail.lastName  = '';
            let dateTime:any;
            dateTime                  = new Date(rYouThere[i].are_you_there_at+' UTC');
            if(dateTime == "Invalid Date"){
              rYouThereDetail.time      = "";
            }else{
              rYouThereDetail.time      = moment(dateTime, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
            }
            let details = JSON.parse(rYouThere[i].details);
            for(let j=0; j<details.length; j++){
              if(details[j].field == 'first_name'){
                rYouThereDetail.firstName = details[j].value;
              }
              if(details[j].field == 'last_name'){
                rYouThereDetail.lastName = details[j].value;
              }
            }
            this.rYouThereDetails.push(rYouThereDetail);
          }
          this.rYouThereRecords = response.body.records;
          // console.log(this.rYouThereDetails);
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

}

