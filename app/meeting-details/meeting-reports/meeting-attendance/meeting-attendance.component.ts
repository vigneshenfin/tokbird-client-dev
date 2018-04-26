import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReportsService } from 'app/reports/reports.service';
import { MeetingReportsService } from 'app/meeting-details/meeting-reports/meeting-reports.service';
import { User } from "app/shared/user";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-meeting-attendance',
  templateUrl: './meeting-attendance.component.html',
  styleUrls: ['./meeting-attendance.component.css'],
  providers: [ReportsService, MeetingReportsService]
})

export class MeetingAttendanceComponent implements OnInit {

  @Input() attendances:any;
  @Input() headers:any;
  @Input() attendanceRecords:any;
  @Input() attendanceSearchParams:any;
  @Input() routeMeetingId;
  @Input() attendanceType;
  @Output() typeChanged = new EventEmitter();
  private _scheduleId: string;
  @Input() set scheduleId(value: string) {
   this._scheduleId = value;
   this.getAttendance();
  }
  get scheduleId(): string {
      return this._scheduleId;
  }
  public attendanceHeaders:any = [];
  public attendanceDetails:any = [];
  public attendanceRecordDetails:any = [];
  public attendanceSearchParamsDetails:any = {};
  p: number = 1;
  public attendanceLimit = 10;
  public attendanceOffset = 1;
  public userDetails:any = [];
  attendanceBusy: Subscription;

  constructor(private user:User, private reportsService:ReportsService, private router:Router, private meetingReportsService:MeetingReportsService) { 
    this.userDetails   = user.getUser();
  }

  ngOnInit() {
    this.attendanceHeaders = this.headers;
    this.attendanceDetails = this.attendances;
  }

  ngOnChanges() {
    this.attendanceHeaders = this.headers;
    this.attendanceDetails = this.attendances;
    this.attendanceRecordDetails = this.attendanceRecords;
    this.attendanceSearchParamsDetails = this.attendanceSearchParams;
    this.p = 1;
  }

  /**
   * Pagination change
   * @param event 
   */
  pageChanged(event) {
    this.attendanceOffset = event;
    this.getAttendance();
  }

  /**
   * Get attendance details on attendance type changes - All, Attended live, Attended on demand
   * @param attType 
   */
  getAttendanceDetails(attType) {
    // Added - 09/02/2018
    this.attendanceOffset = 1;
    this.typeChanged.emit(this.attendanceType);
    this.getAttendance();
  }

  /**
   * Get attendance details
   */
  getAttendance() {
    let params:any = {};
    params.attendance_type = this.attendanceType;
    params.token = this.userDetails.token;
    params.limit = this.attendanceLimit;
    params.offset = this.attendanceOffset;
    // params.meeting_ids = this.attendanceSearchParamsDetails.meetingsIds;
    params.meeting_ids = this.attendanceSearchParams.meetingsIds;
    params.route_meeting_id = this.routeMeetingId;
    params.schedule_id = this.scheduleId;
    // this.attendanceBusy = this.reportsService.attendance(params).subscribe(
    this.attendanceBusy = this.meetingReportsService.attendance(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.p = this.attendanceOffset;
          this.attendanceDetails = [];
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
              let addObj:any = {};
              addObj.label = "Invited";
              addObj.field = "_is_invited";
              addObj.value = "";
              if(attendance[i].is_invited){
                addObj.value = (attendance[i].is_invited == '1' ? 'Yes' : 'No');
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Invited Date";
              addObj.field = "_invited_date";
              addObj.value = "";
              if(attendance[i].invited_date){
                addObj.value = this.formatDate(attendance[i].invited_date);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Pre-registered";
              addObj.field = "_registration_date";
              addObj.value = "";
              if(attendance[i].registration_date){
                addObj.value = this.formatDate(attendance[i].registration_date);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Attended Live";
              addObj.field = "_attended_live";
              addObj.value = "";
              if(attendance[i].live_join_time){
                addObj.value = this.formatDate(attendance[i].live_join_time);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Join Time";
              addObj.field = "_live_join_time";
              addObj.value = "";
              if(attendance[i].live_join_time){
                addObj.value = this.formatTime(attendance[i].live_join_time);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Leave Time";
              addObj.field = "_live_leave_time";
              addObj.value = "";
              if(attendance[i].live_leave_time){
                addObj.value = this.formatTime(attendance[i].live_leave_time);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Watched Time";
              addObj.field = "_live_watched_time";
              addObj.value = "";
              if((attendance[i].live_leave_time) && (attendance[i].live_join_time)){
                let params:any = {};
                params.startDateTime = attendance[i].live_join_time;
                params.endDateTime = attendance[i].live_leave_time;
                addObj.value = this.timeDifference(params);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Attended on demand";
              addObj.field = "_attended_on_demand";
              addObj.value = "";
              if(attendance[i].on_demand_join_time){
                addObj.value = this.formatDate(attendance[i].on_demand_join_time);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Join Time";
              addObj.field = "_on_demand_join_time";
              addObj.value = "";
              if(attendance[i].on_demand_join_time){
                addObj.value = this.formatTime(attendance[i].on_demand_join_time);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Leave Time";
              addObj.field = "_on_demand_leave_time";
              addObj.value = "";
              if(attendance[i].on_demand_leave_time){
                addObj.value = this.formatTime(attendance[i].on_demand_leave_time);
              }
              details.push(addObj);
              addObj = {};
              addObj.label = "Watched Time";
              addObj.field = "_on_demand_watched_time";
              addObj.value = "";
              if((attendance[i].on_demand_leave_time) && (attendance[i].on_demand_join_time)){
                let params:any = {};
                params.startDateTime = attendance[i].on_demand_join_time;
                params.endDateTime = attendance[i].on_demand_leave_time;
                addObj.value = this.timeDifference(params);
              }
              details.push(addObj);

              let field:any = {};
              for(let i = 0; i < details.length; i++){
                let header:any = {};
                attendancesHeaders[details[i].field] = details[i].label;
                field[details[i].field] = details[i].value;
                header.field = details[i].field;
                header.label = this.toTitleCase(details[i].label);
                headerDetails.push(header);
              }
              fieldDetails.push(field);
              attendeeDetails.push(details);
            }
          }
          this.attendanceDetails = fieldDetails;
          var obj = {};
          for ( let i=0, len=headerDetails.length; i < len; i++ )
              obj[headerDetails[i]['field']] = headerDetails[i];
          headerDetails = new Array();
          for ( let key in obj )
              headerDetails.push(obj[key]);

          let headerLength = headerDetails.length;
          for(let i=0; i<headerDetails.length; i++){
            if((headerDetails[i].field == "_is_invited")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_invited_date")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_registration_date")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_attended_live")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_live_join_time")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_live_leave_time")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_live_watched_time")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_attended_on_demand")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_on_demand_join_time")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_on_demand_leave_time")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
            if((headerDetails[i].field == "_on_demand_watched_time")){
              let to = headerLength - 1;
              headerDetails.splice(to, 0, headerDetails.splice(i, 1)[0]);
            }
          }
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
          this.attendanceDetails = attendancesList;
          // this.attendanceRecordDetails = response.body.records;
          this.attendanceRecords = response.body.records;
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

  /**
   * To capitalize first letter of each word
   * @param str 
   */
  toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  /**
   * Format date
   * @param recDate 
   */
  formatDate(recDate) {
    return moment(recDate, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY');
  }

  /**
   * Format time
   * @param recDate 
   */
  formatTime(recDate) {
    // return moment(recDate, 'YYYY-MM-DD hh:mm:ss').format('hh:mm a');
    return moment.utc(recDate).local().format('hh:mm a');
  }

  /**
   * Get difference between two datetime
   * @param params 
   */
  timeDifference(params) {
    var now  = params.endDateTime;
    var then = params.startDateTime;
    var ms = moment(now,"YYYY-MM-DD HH:mm:ss").diff(moment(then,"YYYY-MM-DD HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    return s;
  }

}
