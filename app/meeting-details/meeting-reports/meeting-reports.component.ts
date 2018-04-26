import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { ReportsService } from 'app/reports/reports.service';
import { MeetingReportsService } from 'app/meeting-details/meeting-reports/meeting-reports.service';
import { MESSAGE } from "app/shared/message";
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import 'moment-timezone';


declare var $:any;
declare var google:any;
declare var map:any;

@Component({
  selector: 'app-meeting-reports',
  templateUrl: './meeting-reports.component.html',
  styleUrls: ['./meeting-reports.component.css'],
  providers: [MeetingDetailsService, ReportsService, MeetingReportsService]
})

export class MeetingReportsComponent implements OnInit {

  public userDetails;
  public meetingId = '';
  public meetingStatus;
  public allDataFetched:boolean = false;
  public attendanceLimit = 10;
  public attendanceOffset = 1;
  public attendanceHeaders: any = [];
  public attendanceDetails: any = [];
  public attendanceRecordDetails: any = [];
  public attendanceSearchParamsDetails:any = {};
  public meetingIds:any = [];
  public locationDetails: any = [];
  public locationRecordDetails: any = [];
  public locSearchParamsDetails: any = {};
  public locationsLimit = 10;
  public locationsOffset = 1;
  public selectedTab = '';
  public locationStatus = 0;
  public dashboardDetails: any = [];
  public total_questions    = 0;
  public answered_questions = 0;
  public pollsList:any = [];
  public pollAnswers:any = [];
  public pollQuestions:any = [];
  public meetingPollDetails:any = [];
  public totalPollCount = 0;
  public selectedPoll = '';
  public attendanceType = 1; // All
  public filterType:any = 1;
  // Added - 10/01/2018
  public pollDetails:any = [];
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public accessDenied:boolean = false;
  public allDataFetchedReports:boolean = false;
  public accessMessage = '';
  public mId;
  public totalQ = 0;
  public answeredQ = 0;
  public dashBoard:any  = [];
  public isAccessEnabled:boolean = false;
  public isRescheduled:boolean = false;
  public schedules:any = [];
  public scheduleId = '';
  // Added - 17/04/2018
  public dashboardBusy:boolean = false;

  constructor(private user: User, private activatedRoute:ActivatedRoute, private meetingDetailsService: MeetingDetailsService, private router:Router, private reportsService:ReportsService, private meetingReportsService:MeetingReportsService) { 
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
      this.routeMeetingId = params['meetingId'];
    });
    this.getMeetingStatus();
    this.selectedTab = 'dashboard';

    $(document).ready(function(){
      $(document).on("shown.bs.tab", "a[data-toggle='pill']", function(){
        // google.maps.event.trigger(map, 'resize');
      });
    })
  }

  /**
   * Get status of a meeting - past or future
   * 
   * @author
   * @date 2017-10-26
   */
  getMeetingStatus() {
    let params:any = {};
    params.meeting_id   = this.meetingId;
    params.token   = this.userDetails.token;
    this.meetingDetailsService.getStatus(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          let meeting   = response.body.meeting;
          if((meeting.meeting_status == 3) || (meeting.is_rescheduled == 1)){
            if(meeting.meeting_status == 3){
              this.meetingStatus = 1;
            }else{
              this.meetingStatus = 0;
              this.isRescheduled = true;
            }
            this.allDataFetched = true;
            this.meetingIds = [];
            this.meetingIds.push(this.meetingId);
            this.mId = meeting['m_id'];
            this.checkAccess();
          }else{
            this.redirectHome();
          }
        }else{
          this.redirectHome();
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.redirectLogin();
        }else{
          this.redirectHome();
        }
      }
    )
  }

  /**
   * Participants of meeting
   * @param params 
   */
  attendance(params) {
    params.limit = this.attendanceLimit;
    params.offset = this.attendanceOffset;
    params.attendance_type = this.attendanceType;
    // this.reportsService.attendance(params).subscribe(
    this.meetingReportsService.attendance(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
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
              let details:any = [];
              if(!attendance[i].details){
              }else{
                details = JSON.parse(attendance[i].details);
              }
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
                addObj.value = this.formatTime(attendance[i].on_demand_join_time);
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
              if(details.length > 0){
                for(let i = 0; i < details.length; i++){
                  let header:any = {};
                  if(details[i].field && details[i].label){
                    attendancesHeaders[details[i].field] = details[i].label;
                    field[details[i].field] = details[i].value;
                    header.field = details[i].field;
                    header.label = this.toTitleCase(details[i].label);
                    headerDetails.push(header);
                  }
                }
                fieldDetails.push(field);
                attendeeDetails.push(details);
              }
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
          let fieldsDetails:any = [];
          for(let i=0; i<fieldDetails.length; i++){
            let singleField:any = [];
            for(let key in attendancesHeaders){
              if (fieldDetails[i].hasOwnProperty(key)) {
                singleField.push(fieldDetails[i][key]);
              }else{
                singleField.push(null);
              }
            }
            fieldsDetails.push(singleField);
          }
          this.attendanceDetails = attendancesList;
          this.attendanceRecordDetails = response.body.records;
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.redirectLogin();
        }
      }
    );
  }

  /**
   * Locations of invited users
   * @param params 
   * @author
   * @date 2017-10-26
   */
  locations(params)
  {
    params.limit = this.locationsLimit;
    params.offset = this.locationsOffset;
    // this.reportsService.locations(params).subscribe(
    this.meetingReportsService.locations(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
          this.locationDetails = [];
          this.locationStatus = 1;
          if(response.success == 1){
            let locations = response.body.locations;
            for(let i=0; i<locations.length; i++){
              let attendeeLocation:any = {};
              attendeeLocation.lat = locations[i].lattitude;
              attendeeLocation.lng = locations[i].longitude;
              attendeeLocation.label = locations[i].label; 
              attendeeLocation.firstName = '';
              attendeeLocation.lastName = '';
              let details = JSON.parse(locations[i].details);
              for(let j=0; j<details.length; j++){
                if(details[j].field == 'first_name'){
                  attendeeLocation.firstName = details[j].value;
                }
                if(details[j].field == 'last_name'){
                  attendeeLocation.lastName = details[j].value;
                }
              }
              this.locationDetails.push(attendeeLocation);
            }
            this.locationRecordDetails = response.body.records;
          }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    )
  }

  /**
   * Get dashboard details
   */
  dashboard(params){
    // Added - 17/04/2018
    this.dashboardBusy = true;
    // this.reportsService.getDashboard(params).subscribe(
    this.meetingReportsService.getDashboard(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1 ){
          this.dashBoard = response.body;
          this.getQuestionsCount();
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
   * Get questions count of a meeting
   */
  getQuestionsCount() {
    this.totalQ = 0;
    this.answeredQ = 0;
    let params:any = {};
    params.mId = this.mId;
    params.scheduleId = this.scheduleId;
    // Manage schedules here
    this.reportsService.getQuestionsCount(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response['totalQ']){
          this.totalQ += response['totalQ'];
        }
        if(response['answeredQ']){
          this.answeredQ += response['answeredQ'];
        }
        this.dashBoard.total_questions = this.totalQ;
        this.dashBoard.answered_questions = this.answeredQ;
        this.dashboardDetails = this.dashBoard;
        // Added - 17/04/2018
        this.dashboardBusy = false;
      },
      (error) => {
      }
    )
  }

  /**
   * Get polls used in meeting
   */
  polls(params) {
    this.meetingReportsService.polls(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.pollsList = response.body.polls;
          if(this.pollsList.length > 0){
            if(this.pollsList[0]){
              let params:any ={};
              params.meeting_id = this.meetingId;
              params.poll_id = this.pollsList[0].id;
              params.token = this.userDetails.token;
              this.getMeetingPollDetails(params);
            }
          }
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    )
  }

  /**
   * Get meeting poll details
   * @param params 
   */
  getMeetingPollDetails(params) {
    params.route_meeting_id = this.routeMeetingId;
    this.meetingReportsService.meetingPollDetails(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          // New codes
          let pollQuestions = response.body.poll_questions;
          let pollAnswers = response.body.poll_answers;
          let answers:any = {};
          let maxUsers = 0;
          for(let i=0; i<pollAnswers.length; i++){
            let key = pollAnswers[i].question_id;
            let inviteesCount = pollAnswers[i].invited_users_count;
            answers[key] = pollAnswers[i];
            if(inviteesCount > maxUsers){
              maxUsers = inviteesCount;
            }
          }
          let answersArray:any = [];
          for(let i=0; i<pollQuestions.length; i++){
            let questionId = pollQuestions[i].id;
            let instances:any = {};
            if((answers[questionId]) && (answers[questionId].answers != '')){
              let qAnswers:any = answers[questionId].answers.split(',');
              for(let j=0; j<qAnswers.length; j++){
                let key = qAnswers[j];
                instances[key] = (instances[key]) ? instances[key] + 1 : 1 ;
              }
            }
            let answer:any = {};
            answer.questionId = pollQuestions[i].id;
            answer.question = pollQuestions[i].question;
            let qOptions:any = JSON.parse(pollQuestions[i].options);
            let options:any = [];
            for(let k=0; k<qOptions.length; k++){
              let option:any = {};
              option.value = qOptions[k].value;
              option.label = qOptions[k].label;
              option.percentage = 0;
              option.instanceCount = 0;
              if((!this.isEmpty(instances)) && (maxUsers > 0)){
                let instance = 0;
                if(instances[option.value]){
                  instance = instances[option.value];
                  option.percentage = (instance/maxUsers)*100;
                  option.usersCount = instance;
                }
              }
              options.push(option);
            }
            answer.options = options;
            answersArray.push(answer);
          }
          this.pollDetails = answersArray;
          // New codes ends
        }
      }
    )
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  /**
   * Get poll questions
   * @param params 
   * @date 2017-10-28
   */
  getPollQuestions(params) {
    this.meetingReportsService.pollQuestions(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.getQuestionAnswers(params);
        }
      },
      (error) => {
      }
    )
  }

  getQuestionAnswers(params) {
    this.meetingReportsService.pollQuestionAnswers(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
        }
      },
      (error) => {
      }
    )
  }

  /**
   * Select report tabs
   * @param tab 
   */
  selectTab(tab){
    this.selectedTab = tab;
  }

  /**
   * Export report to csv
   * 
   * @author
   * @date 2017-10-26
   */
  exportCsv() {
    // get the user's timezone
    // var tz = moment.tz.guess();
    // console.info('Timezone: ' + tz);
    // console.log(moment("2014-06-01T12:00:00Z").tz('America/Los_Angeles').format('ha z'));
    // console.log(moment.tz.zone);
    // let tz = moment.tz();
    // console.log(tz.zone);
    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let params:any = {};
    params.token = this.userDetails.token;
    params.route_meeting_id = this.routeMeetingId;
    params.schedule_id = this.scheduleId;
    params.attendance_type = this.attendanceType;
    params.local_timezone = localTimeZone;
    if(this.selectedTab == 'location'){
      params.export_type = "csv";
      params.meeting_ids = this.meetingIds;
      params.local_timezone = localTimeZone;
      // this.reportsService.locationCsv(params).subscribe(
      this.meetingReportsService.locationCsv(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Locations_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'attendance'){
      params.export_type = "csv";
      params.meeting_ids = this.meetingIds;
      params.attendance_type = this.attendanceType;
      params.local_timezone = localTimeZone;
      // this.reportsService.attendanceExport(params).subscribe(
      this.meetingReportsService.attendanceExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Attendance_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'polls'){
      if(this.selectedPoll != ''){
        params.meeting_ids = this.meetingIds;
        params.poll_id = this.selectedPoll;
        params.export_type = "csv";
        // this.meetingReportsService.pollsExport(params).subscribe(
        params.meeting_id = this.meetingId;
        this.meetingReportsService.exportConsolidated(params).subscribe(
          (res) => {
            FileSaver.saveAs(res, "Polls_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
          }
        )
      }
    }else if(this.selectedTab == 'dashboard'){
        params.meeting_ids        = this.meetingIds;
        params.total_questions    = this.total_questions;
        params.answered_questions = this.answered_questions;
        params.export_type        = "csv";
        // this.reportsService.dashboardExport(params).subscribe(
        this.meetingReportsService.dashboardExport(params).subscribe(
          (res) => {
              FileSaver.saveAs(res, "Dashboard_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
              var fileURL = URL.createObjectURL(res);
              //window.open(fileURL); // if you want to open it in new tab
          }
        );
    }else if(this.selectedTab == 'areYouThere'){
      params.export_type = "csv";
      params.meeting_ids = this.meetingIds;
      params.local_timezone = localTimeZone;
      this.meetingReportsService.areYouThereExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Areyouthere_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'q_and_a'){
      params.export_type = "csv";
      params.meeting_id  = this.mId;
      params.filter_type = this.filterType;
      let filename       = "All_questions";
      if(this.filterType == 'open'){
          filename  = "Open_questions";
      }else if(this.filterType == 'closed'){
          filename  = "Answered_questions";
      }else{
          filename  = "All_questions";
      }
      // this.reportsService.attendanceExport(params).subscribe(
      this.meetingReportsService.qAndAExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, filename+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }
  }

  /**
   * Export reports to pdf
   * 
   * @author
   * @date 2017-10-26
   */
  exportPdf() {
    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let params:any = {};
    params.token = this.userDetails.token;
    params.route_meeting_id = this.routeMeetingId;
    params.schedule_id = this.scheduleId;
    params.attendance_type = this.attendanceType;
    params.local_timezone = localTimeZone;
    if(this.selectedTab == 'location'){
      params.meeting_ids = this.meetingIds;
      // params.local_timezone = localTimeZone;
      // this.reportsService.locationPdf(params).subscribe(
      this.meetingReportsService.locationPdf(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Locations_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'attendance'){
      params.meeting_ids = this.meetingIds;
      params.export_type = "pdf";
      params.attendance_type = this.attendanceType;
      params.local_timezone = localTimeZone;
      // this.reportsService.attendanceExport(params).subscribe(
      this.meetingReportsService.attendanceExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Attendance_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'polls'){
      if(this.selectedPoll != ''){
        params.meeting_ids = this.meetingIds;
        params.poll_id = this.selectedPoll;
        params.export_type = "pdf";
        // this.meetingReportsService.pollsExport(params).subscribe(
        params.meeting_id = this.meetingId;
        this.meetingReportsService.exportConsolidated(params).subscribe(
          (res) => {
              FileSaver.saveAs(res, "Polls_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
              var fileURL = URL.createObjectURL(res);
              // window.open(fileURL); // if you want to open it in new tab
          }
        );
      }
    }else if(this.selectedTab == 'dashboard'){
      params.meeting_ids        = this.meetingIds;
      params.total_questions    = this.total_questions;
      params.answered_questions = this.answered_questions;
      params.export_type        = "pdf";
      // this.reportsService.dashboardExport(params).subscribe(
      this.meetingReportsService.dashboardExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Dashboard_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'areYouThere'){
      params.meeting_ids = this.meetingIds;
      params.export_type = "pdf";
      params.local_timezone = localTimeZone;
      this.meetingReportsService.areYouThereExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Areyouthere_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'q_and_a'){
      params.meeting_id  = this.mId;
      params.filter_type = this.filterType;
      params.export_type = "pdf";
      let filename       = "All_questions";
      if(this.filterType == 'open'){
          filename  = "Open_questions";
      }else if(this.filterType == 'closed'){
          filename  = "Answered_questions";
      }else{
          filename  = "All_questions";
      }
      // this.reportsService.attendanceExport(params).subscribe(
      this.meetingReportsService.qAndAExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, filename+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }
  }

  /**
   * Change in selected poll
   * @param pollId 
   */
  pollChangedHandler(pollId:string) {
    this.selectedPoll = pollId;
  }


  /**
   * Attendance type change - All, Attended live, Attended on demand
   * @param typeId 
   */
  typeChangedHandler(typeId:number) {
    this.attendanceType = typeId;
  }

  filterChangedHandler(filterType:any){
   if(filterType == 1){
    this.filterType = 'all';
   }else if(filterType == 2){
     this.filterType = "open";
   }else{
     this.filterType = "closed";
   }
    
  }

  /**
   * Redirects to login page based on user role
   */
  redirectLogin()
  {
    if(this.roleId == '1') {
      // Admin
      this.router.navigateByUrl('/admin/login');
    }else{
      // Facilitator/Registered user
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Redirects to home page based on user role
   */
  redirectHome()
  {
    if(this.roleId == '3'){
      // Registered user
      this.router.navigateByUrl('/meetings-list');
    }else{
      // Admin/Facilitator
      this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
    }
  }

  /**
   * Check access permission
   */
  checkAccess()
  {
    let params:any = {};
    params.token   = this.userDetails.token;
    params.route_meeting_id   = this.routeMeetingId;
    this.meetingReportsService.checkAccess(params).subscribe(
        (response:any) => {
          this.allDataFetchedReports = true;
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            // this.schedules = response.body.schedules;
            this.processSchedules(response.body.schedules);
            let params:any = {};
            params.meeting_ids = this.meetingIds;
            params.token = this.userDetails.token;
            params.schedule_id = this.scheduleId;
            this.attendanceSearchParamsDetails.meetingsIds = this.meetingIds;
            this.locSearchParamsDetails.meetingsIds = this.meetingIds;
            params.route_meeting_id = this.routeMeetingId;
            this.dashboard(params);
            // Commented - 15/03/2018
            // this.attendance(params);
            let pollParams:any = {};
            pollParams.meeting_id   = this.meetingId;
            pollParams.token   = this.userDetails.token;
            pollParams.route_meeting_id = this.routeMeetingId;
            // Commented - 13/03/2018
            // this.polls(pollParams);
            this.isAccessEnabled = true;
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }else if(error.hasOwnProperty('status')) {
            if(error.status == 'access_denied'){
              this.accessDenied = true;
              this.accessMessage = MESSAGE.ACCESS_PERMISSION_DENIED;
            }
          }else{
            this.redirectHome();
          }
        }
    );
  }

  /**
   * Process schedules
   * @param schedules 
   */
  processSchedules(schedules) {
    for(let i=0; i<schedules.length; i++){
      let localTime = moment.utc(schedules[i].scheduled_date_utc).local().format('DD MMM. YYYY, hh:mm a');
      schedules[i].scheduled_date_utc = localTime;
    }
    this.schedules = schedules;
    if(schedules.length > 0){
      this.scheduleId = schedules[0].id;
    }
  }

  /**
   * Get dashboard details based on schedule id
   * @param schId 
   */
  getDashboardDetails(schId = '') {
    if(schId != ''){
      let params:any = {};
      params.meeting_ids = this.meetingIds;
      params.token = this.userDetails.token;
      params.schedule_id = this.scheduleId;
      params.route_meeting_id = this.routeMeetingId;
      this.dashboard(params);
    }
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
