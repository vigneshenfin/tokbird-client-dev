import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { CategoryService } from 'app/category/category.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReportsService } from 'app/reports/reports.service';
import { MeetingsComponent } from 'app/reports/meetings/meetings.component';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as FileSaver from 'file-saver';
import 'rxjs/Rx';  
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from 'app/config/config';
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MESSAGE } from "app/shared/message";

import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;
// declare var moment:any;
declare var saveAs:any;
declare var google:any;
declare var map:any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [CategoryService, ReportsService],
  entryComponents:[MeetingsComponent]
})

export class ReportsComponent implements OnInit {
  
  title1 = 'app works!';
  parentInput = 'parent to child';
  public title = '';
  public categories = '';
  public startDate = '';
  public endDate = '';
  public mId = '';
  public items: any = [];
  public userDetails: any = {};
  public meetingDetails: any = [];
  public dashboardDetails: any = [];
  public attendanceDetails: any = [];
  public locationDetails: any = [];
  public selectedTab   = '';
  public searchTitle = '';
  public searchCategories = '';
  public searchStartDate = '';
  public searchEndDate = '';
  public searchMid = '';
  public recordDetails: any = [];
  public locationRecordDetails: any = [];
  public attendanceRecordDetails: any = [];
  public limit = 10;
  public offset = 1;
  public locationsLimit = 10;
  public locationsOffset = 1;
  public attendanceLimit = 10;
  public attendanceOffset = 1;
  public attendanceHeaders: any = [];
  public locSearchParamsDetails: any = {};
  public searchParamsDetails:any = {};
  public attendanceSearchParamsDetails:any = {};
  public allMeetingIds:any = [];
  public meetingIds :any;
  public total_questions    = 0;
  public answered_questions = 0;
  public searchStatus = 0;
  public emptyMeetings = 0;
  public noResults = 0;
  public attendanceType = 1; // All
  // Added - 02/02/2018
  public addHeaders:any = [];
  public addDetails:any = [];
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public allDataFetched:boolean = false;
  public accessDenied:boolean = false;
  public accessMessage = '';
  public mIds:any = [];
  public totalQ = 0;
  public answeredQ = 0;
  public questionDetails:any = {};
  public dashBoard:any  = [];
  public isAccessEnabled:boolean = false;
  // Added - 17/04/2018
  public dashboardBusy:boolean = false;

  constructor(private user:User, private categoryService:CategoryService, private router:Router, private activatedRoute:ActivatedRoute, private reportsService:ReportsService, private http: Http) {
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
      if(params['meetingId']){
        this.routeMeetingId   = params['meetingId'];
      }
    });
    if(this.roleId != '3'){
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }
    this.checkAccess();
    this.selectedTab = 'meetings';
    $(document).ready(function(){
      $('#meeting_date').datepicker({
          orientation: "bottom",
          // autoclose: true
      }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('#meeting_date_to').datepicker('setStartDate', minDate);
      });
      $('#meeting_date_to').datepicker({
          orientation: "bottom",
          // autoclose: true
      }).on('changeDate', function (selected) {
          var maxDate = new Date(selected.date.valueOf());
          $('#meeting_date').datepicker('setEndDate', maxDate);
      });
      $(document).on('shown.bs.tab', "a[data-toggle='pill']", function(){
        // google.maps.event.trigger(map, 'resize');
      })
    });
  }

  /**
   * Get categories for search
   */
  getCategories()
  {
    let params:any = {};
    params.token   = this.userDetails.token;
    this.categoryService.getCategories(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            let categoriesArray = response.body.categories;
            for(let category of categoriesArray){
              let item:any = {};
              item.display = category['category_name'];
              item.value = category['id'];
              this.items.push(item);
            }
          }
        },
        (error) => {
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.router.navigateByUrl('/');
          }else{
            this.redirectHome();
          }
        }
      );
  }

  /**
   * Search meetings
   * @param event 
   * @param formInfo 
   */
  searchMeeting(event, formInfo:NgForm) {
    if(formInfo.valid){
      let params: any = {};
      params.token = this.userDetails.token;
      params.title = formInfo.value.title;
      params.m_id = formInfo.value.mId;
      params.category_ids = formInfo.value.categories;
      params.start_date = formInfo.value.startDate;
      params.end_date = formInfo.value.endDate;
      this.searchTitle = formInfo.value.title;
      this.searchCategories = formInfo.value.categories;
      this.searchStartDate = formInfo.value.startDate;
      this.searchEndDate = formInfo.value.endDate;
      this.searchMid = formInfo.value.mId;
      params.route_meeting_id = this.routeMeetingId;
      this.meetings(params);
    }
  }

  /**
   * Get meetings
   * @param params 
   */
  meetings(params) {
    this.searchStatus   = 1;
    this.searchParamsDetails.title = this.searchTitle;
    this.searchParamsDetails.mId = this.searchMid;
    this.searchParamsDetails.categories = this.searchCategories;
    this.searchParamsDetails.startDate = this.searchStartDate;
    this.searchParamsDetails.endDate = this.searchEndDate;
    params.limit = this.limit;
    params.offset = this.offset;
    this.reportsService.meetings(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          this.meetingDetails = [];
          this.meetingIds = [];
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
          this.meetingIds = response.body.all_meeting_ids;
          this.allMeetingIds = this.meetingIds;
          this.locSearchParamsDetails.meetingsIds = this.meetingIds;
          this.attendanceSearchParamsDetails.meetingsIds = this.meetingIds;
          this.recordDetails = response.body.records;
          if (this.meetingIds.length === 0) {
            this.noResults = 1;
          }else{
            this.noResults = 0;
          }
          this.mIds = response.body.m_ids;
          let params:any = {};
          params.meeting_ids = this.meetingIds;
          params.token = this.userDetails.token;
          params.route_meeting_id = this.routeMeetingId;
          this.attendance(params);
          this.locations(params);
          this.dashboard(params);
        }
      },
      (error) => {
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          this.user.logOut();
          this.router.navigateByUrl('/');
        }else{
          this.redirectHome();
        }
      }
    );

  }

  /**
   * Export report as CSV
   */
  exportCsv() {

    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let params:any = {};
    params.token = this.userDetails.token;
    params.start_date = this.searchStartDate;
    params.end_date = this.searchEndDate;
    params.category_ids = this.searchCategories;
    params.title = this.searchTitle;
    params.m_id = this.searchMid;
    params.route_meeting_id = this.routeMeetingId;
    if(this.selectedTab == 'meetings'){
      params.export_type = "csv";
      this.reportsService.meetingsCsv(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Meetings_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'dashboard'){
        params.meeting_ids        = this.meetingIds;
        params.total_questions    = this.total_questions;
        params.answered_questions = this.answered_questions;
        params.export_type        = "csv";
        this.reportsService.dashboardExport(params).subscribe(
          (res) => {
              FileSaver.saveAs(res, "Dashboard_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
              var fileURL = URL.createObjectURL(res);
              //window.open(fileURL); // if you want to open it in new tab
          }
        );
    }else if(this.selectedTab == 'location'){
      params.export_type = "csv";
      params.meeting_ids = this.allMeetingIds;
      this.reportsService.locationCsv(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Locations_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'attendance'){
      params.export_type = "csv";
      params.meeting_ids = this.allMeetingIds;
      params.attendance_type = this.attendanceType;
      params.local_timezone = localTimeZone;
      this.reportsService.attendanceExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Attendance_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'areYouThere'){
      params.export_type = "csv";
      params.meeting_ids = this.meetingIds;
      this.reportsService.areYouThereExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Areyouthere_"+moment().format('YYYYMMDDhmmss')+".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }
  }

  /**
   * Export report as CSV
   */
  exportPdf() {
    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let params:any = {};
    params.token = this.userDetails.token;
    params.start_date = this.searchStartDate;
    params.end_date = this.searchEndDate;params
    params.category_ids = this.searchCategories;
    params.title = this.searchTitle;
    params.m_id = this.searchMid;
    params.route_meeting_id = this.routeMeetingId;
    if(this.selectedTab == 'meetings'){
      params.export_type = "pdf";
      this.reportsService.meetingsExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Meetings_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'dashboard'){
      params.meeting_ids        = this.meetingIds;
      params.total_questions    = this.total_questions;
      params.answered_questions = this.answered_questions;
      params.export_type        = "pdf";
      this.reportsService.dashboardExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Dashboard_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'location'){
      params.meeting_ids = this.allMeetingIds;
      this.reportsService.locationPdf(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Locations_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'attendance'){
      params.meeting_ids = this.allMeetingIds;
      params.export_type = "pdf";
      params.attendance_type = this.attendanceType;
      params.local_timezone = localTimeZone;
      this.reportsService.attendanceExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Attendance_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }else if(this.selectedTab == 'areYouThere'){
      params.meeting_ids = this.meetingIds;
      params.export_type = "pdf";
      this.reportsService.areYouThereExport(params).subscribe(
        (res) => {
            FileSaver.saveAs(res, "Areyouthere_"+moment().format('YYYYMMDDhmmss')+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
            var fileURL = URL.createObjectURL(res);
            // window.open(fileURL); // if you want to open it in new tab
        }
      );
    }
  }

  /**
   * Change attendance type (All, Attended live, Attended on demand)
   * @param typeId 
   */
  typeChangedHandler(typeId:number) {
    this.attendanceType = typeId;
  }

  /**
   * Get attended users
   * @param params 
   */
  attendance(params) {
    params.limit = this.attendanceLimit;
    params.offset = this.attendanceOffset;
    params.route_meeting_id = this.routeMeetingId;
    params.attendance_type = this.attendanceType;
    this.reportsService.attendance(params).subscribe(
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
          this.router.navigateByUrl('/');
        }else{
          this.redirectHome();
        }
      }
    );
  }

  /**
   * Get locations of invited users for meetings
   * @author Paul P Elias
   * @date 2017-10-09
   * @param params 
   */
  locations(params)
  {
    params.limit = this.locationsLimit;
    params.offset = this.locationsOffset;
    params.route_meeting_id = this.routeMeetingId;
    this.reportsService.locations(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
          this.locationDetails = [];
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
        }else{
          this.redirectHome();
        }
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
   * Dashboard details
   * @param params 
   */
  dashboard(params){
    // Added - 17/04/2018
    this.dashboardBusy = true;
    params.route_meeting_id = this.routeMeetingId;
    this.reportsService.getDashboard(params).subscribe(
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
        }else{
          this.redirectHome();
        }
      }
    );

  }

  /**
   * Get no of questions in a meeting
   */
  getQuestionsCount() {
    let counter = 0;
    let maxCount = this.mIds.length;
    this.totalQ = 0;
    this.answeredQ = 0;
    for(let i=0; i<this.mIds.length; i++){
      let params:any = {};
      params.mId = this.mIds[i];
      this.reportsService.getQuestionsCount(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response['totalQ']){
            this.totalQ += response['totalQ'];
          }
          if(response['answeredQ']){
            this.answeredQ += response['answeredQ'];
          }
          counter++;
          if(counter == maxCount){
            this.dashBoard.total_questions = this.totalQ;
            this.dashBoard.answered_questions = this.answeredQ;
            this.dashboardDetails = this.dashBoard;
            // Added - 17/04/2018
            this.dashboardBusy = false;
          }
        },
        (error) => {
        }
      )
    }
    
  }

  /**
   * Reset search form
   * @param event 
   * @param searchForm 
   */
  resetSearch(event, searchForm:NgForm) {
    searchForm.resetForm();
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
    params.route_meeting_id = this.routeMeetingId;
    this.reportsService.checkAccess(params).subscribe(
        (response:any) => {
          this.allDataFetched = true;
          this.isAccessEnabled = true;
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.getCategories();
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
   * Format timezone
   * @param timezone 
   */
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
