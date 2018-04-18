import { Component, OnInit, Input } from '@angular/core';
import { ReportsService } from 'app/reports/reports.service';
import { User } from "app/shared/user";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import 'moment-timezone';

// declare var moment:any;
declare var $:any;

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css'],
  providers: [ReportsService]
})
export class MeetingsComponent implements OnInit {
  @Input() meetings:any;
  @Input() records:any;
  @Input() searchParams:any;
  @Input() emptyMeetingsList;
  @Input() routeMeetingId;
  public meetingDetails:any = [];
  public recordDetails:any = [];
  public searchParamsDetails:any = [];
  public emptyMeetings = 0;
  p: number = 1;
  public limit = 10;
  public offset = 1;
  public userDetails:any = [];
  busy: Subscription;
  constructor(private user:User, private reportsService:ReportsService, private router:Router) {
    this.userDetails   = user.getUser();
  }
  
  ngOnInit() {
    this.meetingDetails = this.meetings;
    $(document).ready(function() {
      $(".table-map-scroll").scroll(function() {
        if ($(".table-map-scroll").scrollTop() == ($(".table-reg-height").height() - $(".table-map-scroll").height())){
        }
      });
    })
  }

  ngOnChanges() {
    this.meetingDetails = this.meetings;
    this.recordDetails = this.records;
    this.searchParamsDetails = this.searchParams;
    this.p = 1;
    this.emptyMeetings = this.emptyMeetingsList;
    // console.log(this.emptyMeetingsList);
    // console.log(this.emptyMeetings);
  }

  pageChanged(event) {
    // console.log(event);
    // this.p = event;
    this.offset = event;
    this.getMeetings();
  }

  getMeetings() {
    let params:any = {};
    params.limit = this.limit;
    params.offset = this.offset;
    params.token = this.userDetails.token;
    params.title = this.searchParamsDetails.title;
    params.category_ids = this.searchParamsDetails.categories;
    params.start_date = this.searchParamsDetails.startDate;
    params.end_date = this.searchParamsDetails.endDate;
    // Added - 17/11/2017
    params.route_meeting_id = this.routeMeetingId;
    this.busy = this.reportsService.meetings(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.meetingDetails = [];
          this.p = this.offset;
          let meetingsList = response.body.meetings;
          for(let i=0; i<meetingsList.length; i++){
            let meeting:any = {};
            meeting.title = meetingsList[i].meeting_title;
            if((meeting.title).length > 60){
              meeting.title = (meeting.title).substr(0, 56) + '..';
            }
            meeting.accessCode = meetingsList[i].access_code;
            meeting.meetingCode = meetingsList[i].meeting_code;
            meeting.scheduleDate = moment(meetingsList[i].meeting_date_time, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
            meeting.mId = meetingsList[i].m_id;
            meeting.timezoneAbbrev = this.formatTimezone(meetingsList[i].timezone);
            this.meetingDetails.push(meeting);
          }
          if(meetingsList == ''){
            this.emptyMeetings = 1;
          }else{
            this.emptyMeetings = 0;
          }
          this.recordDetails = response.body.records;
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

  formatTimezone(timezone) {
    if(timezone){
      let tz = timezone.split(" ");
      if ( tz[1] !== void 0 ) {
        return moment().tz(tz[1]).zoneAbbr(); 
      }else{
        return false;
      }
    }
  }

}
