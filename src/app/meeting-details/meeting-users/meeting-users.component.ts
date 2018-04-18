import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'app/shared/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Config } from 'app/config/config';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { MeetingUsersService } from 'app/meeting-details/meeting-users/meeting-users.service';
declare var moment:any;

@Component({
  selector: 'app-meeting-users',
  templateUrl: './meeting-users.component.html',
  styleUrls: ['./meeting-users.component.css'],
  providers: [MeetingUsersService]
})
export class MeetingUsersComponent implements OnInit {

  public meetingId;
  public userDetails;
  public userType = 1; // Registered
  public roleId;
  public urlPrefix = '';
  public limit = 10;
  public offset = 1;
  public users:any = [];
  public recordDetails:any = [];
  public pageTitle = '';
  public meetingTitle = '';
  public tableHeaders:any = [];
  public schedules:any = [];
  public scheduleId = '';
  p: number = 1;
  busy: Subscription;

  constructor(private _location: Location, private meetingUsersService: MeetingUsersService, private router:Router, private activatedRoute:ActivatedRoute, private user:User) {
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
    let routeUrl = router.url;
    let pathArray = routeUrl.split( '/' );
    let usType = 1; // Registerd
    if(pathArray.length >= 4){
      let type = pathArray[2];
      if(this.roleId != 3){
        type = pathArray[3];
      }
      if(type =="registered"){
        usType = 1;
        this.pageTitle = 'Registered Users';
        this.tableHeaders = [{"label":"First Name", "value":"first_name"}, {"label":"Last Name", "value":"last_name"}, {"label":"Email Address", "value":"email_id"}, {"label":"Registration Date", "value":"registration_date"}];
      }else if(type == "attended"){
        usType = 2; // Attended
        this.pageTitle = 'Attended Users';
        this.tableHeaders = [{"label":"First Name", "value":"first_name"}, {"label":"Last Name", "value":"last_name"}, {"label":"Email Address", "value":"email_id"}, {"label":"Attended Date", "value":"live_join_time"}];
      }else if(type == "watched"){
        usType = 3; // Watched
        this.pageTitle = 'Watched Recordings';
        this.tableHeaders = [{"label":"First Name", "value":"first_name"}, {"label":"Last Name", "value":"last_name"}, {"label":"Email Address", "value":"email_id"}, {"label":"Watched Date", "value":"on_demand_join_time"}];
      }
    }
    this.userType = usType;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    this.getSchedules();
    this.getUsers();
  }

  /**
   * Get users
   */
  getUsers()
  {
    let params:any = {};
    params.limit = this.limit;
    params.offset = this.offset;
    params.token = this.userDetails.token;
    params.meeting_id = this.meetingId;
    params.inv_user_type = this.userType;
    params.schedule_id = this.scheduleId;
    this.busy = this.meetingUsersService.getUsers(params).subscribe(
      (response:any) => {
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          this.users = response.body.users;
          for(let i=0; i< this.users.length; i++){
            if(this.userType == 1){
              let regDate = this.users[i].registration_date;
              this.users[i].registration_date = moment(regDate).format('DD/MM/YYYY');
            }else if(this.userType == 2){
              let attDate = this.users[i].live_join_time;
              this.users[i].live_join_time = moment(attDate).format('DD/MM/YYYY');
            }else if(this.userType == 3){
              let watchDate = this.users[i].on_demand_join_time;
              this.users[i].on_demand_join_time = moment(watchDate).format('DD/MM/YYYY');
            }
          }
          this.p = this.offset;
          this.recordDetails = response.body.records;
          this.meetingTitle = response.body.meeting_title;
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
   * Get users when page change
   * @param event 
   */
  pageChanged(event) {
    this.offset = event;
    this.getUsers();
  }

  /**
   * Export users list to CSV
   */
  exportCsv() {
    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_id = this.meetingId;
    params.inv_user_type = this.userType;
    params.schedule_id = this.scheduleId;
    params.local_timezone = localTimeZone;
    params.export_type = "csv";
    let csvName = '';
    if(this.userType == 1){
      csvName = 'Registered_users';
    }else if(this.userType == 2){
      csvName = 'Attended_users';
    }else{
      csvName = 'Watched_users';
    }
    this.meetingUsersService.exportCsv(params).subscribe(
      (res) => {
          FileSaver.saveAs(res, csvName + moment().format('YYYYMMDDhmmss') + ".csv"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
          var fileURL = URL.createObjectURL(res);
          // window.open(fileURL); // if you want to open it in new tab
      }
    );
  }

  /**
   * Redirect to login page based on user role (Admin/Facilitator/Registered user)
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
   * Redirect to home page based on user role (Admin/Facilitator/Registered user)
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
   * Back button
   */
  backClicked() {
      this._location.back();
  }

  /**
   * Get schedule details of a meeting
   */
  getSchedules() {
    if(this.meetingId){
      let params:any = {};
      params.meeting_id = this.meetingId;
      params.token = this.userDetails.token;
      this.meetingUsersService.getSchedules(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            let scheduleDetails = response.body.schedule_details;
            this.processSchedules(scheduleDetails);
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
      // this.scheduleId = schedules[0].id;
    }
  }

  /**
   * Get users when schedule changes
   */
  getMeetingUsers(scheduleId = ''){
    this.getUsers();
  }

}
