import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserMeetingsListService } from 'app/user-meetings/user-meetings-list/user-meetings-list.service';
import { InviteUsersService } from 'app/meeting-details/invite-users/invite-users.service';
import { MeetingService } from 'app/meeting/meeting.service';
import { ToastrService } from 'toastr-ng2';
import { Subscription } from 'rxjs';
import {Observable} from 'rxjs/Rx';
import { User } from 'app/shared/user';
import { Config } from "app/config/config";
import * as moment from 'moment';
import 'moment-timezone';
import { StaticService } from 'app/shared/staticdata';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
// declare var moment;
declare var $:any;
declare var google;

@Component({
  selector: 'app-user-meetings-list',
  templateUrl: './user-meetings-list.component.html',
  styleUrls: ['./user-meetings-list.component.css'],
  providers: [UserMeetingsListService, MeetingService, InviteUsersService,StaticService,DatePipe]
})
export class UserMeetingsListComponent implements OnInit {

  @ViewChild('g') reinvite_form;
  public userDetails;
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public selectedTab;
  public meetings:any = [];
  public limit = 10;
  public offset = 1;
  public recordDetails:any = [];
  public keyword = '';
  public geolocationPosition;
  isDataAvailable:boolean = false;
  p: number = 1;
  busy: Subscription;
  public pastMeetings:any = [];
  public pastLimit = 10;
  public pastOffset = 1;
  public pastRecordDetails:any = [];
  public pastKeyword = '';
  pastIsDataAvailable:boolean = false;
  pastP: number = 1;
  pastBusy: Subscription;
  public cancelMeetingId   = '';
  public autoReload:boolean = false;
  // loadMeeting:Subscription;
  public interval;
  public disableCancel:boolean = false;
  public geocoder;
  public latitude = 0.000000;
  public longitude = 0.000000;
  public sprout = 0;
  public place = '';
  public timezone = "-05:00 US/Central";
  public timezoneErrorMsg  = "";
  public schedule_date;
  public dateError:boolean = false;
  public timeZones;
  public meetingId;
  public invitationContent = '';
  public invitationContentError = 0;
  public rejoinDate:any = "";
  public meetingTitle = "";
  public rejoinTimezone:any = "";
  public usZones:any = [];
  public intlZones:any = [];
  public invite_users = 0;
  public title = '';

  constructor(private datePipe :DatePipe,private staticService:StaticService,private userMeetingsListService: UserMeetingsListService, private meetingService: MeetingService, private inviteUsersService:InviteUsersService, private toastrService: ToastrService, private router:Router, private activatedRoute:ActivatedRoute, private user:User) { 
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
    this.timeZones     = this.staticService.getTimezones();
    this.usZones       = this.staticService.getUsZones();
    this.intlZones     = this.staticService.getIntlZones();
  }

  ngOnInit() {
    this.geocoder = new google.maps.Geocoder();
    // Commented - 26/03/2018
    this.getGeoLocation();
    // Added - 26/03/2018
    // setTimeout(()=>{
    //   this.getGeoLocation();
    // },10000);

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
    this.selectedTab = 'future_meetings';
    // this.getUserMeetings();
    // this.getUserPastMeetings();
    this.getUserEvents();
    this.getUserPastEvents();
    this.interval = setInterval(() => {
      this.autoReload = true;
      // this.getUserMeetings();
      // this.getUserPastMeetings();
      this.getUserEvents();
      this.getUserPastEvents();
    }, 1000 * 60);

    /*DataTable search show and hide */
    $("#past_meeting").on("click", function() {
        $("#future_meetings_search").hide();
        $("#past_meetings_search").show();

    });

    /*DataTable search show and hide */
    $("#future_meeting").on("click", function() {
        $("#future_meetings_search").show();
        $("#past_meetings_search").hide();
    });

    /* Bs tab on click Initialization */
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $('#calendar').fullCalendar('render');
    });

    $('.table-responsive').on('show.bs.dropdown', function () {
     $('.table-responsive').css( "overflow", "inherit" );
    });
    
    $('.table-responsive').on('hide.bs.dropdown', function () {
         $('.table-responsive').css( "overflow", "auto" );
    })

    $(document).ready(function(){
      $('a[data-toggle="pill"]').on('show.bs.tab', function(e) {
          localStorage.setItem('activeTab', $(e.target).attr('href'));
      });
      var activeTab = localStorage.getItem('activeTab');
      if(activeTab){
          $('a[href="' + activeTab + '"]').tab('show');
      }
    });
 
    
  }

  ngAfterViewInit(){
    $('#datetimepicker').datetimepicker({
      minDate: new Date(),
      sideBySide: true
    });

    $('#datetimepicker').on('dp.change', (e) => { 
      if(e.date._isValid){
        this.rejoinDate = e.date._d.toString();
        this.rejoinDate =  this.datePipe.transform(this.rejoinDate, 'MMM d, y, h:mm:ss a');
        // __this.dateError = false;
        this.dateError = false;
        this.changeSchedule();
      }else{
        // __this.dateError = true;
        this.dateError = true;
      } 
    })

  }

  ngOnDestroy() {
    if (this.interval) {
        clearInterval(this.interval);
    }
  }

  /**
   * Get current latitude, longitude, place - Save host information while enter meeting
   */
  getGeoLocation() {
    // console.log('enter');
    if (window.navigator && window.navigator.geolocation) {
      // console.log('yes');
        window.navigator.geolocation.getCurrentPosition(
            position => {
                this.geolocationPosition = position;
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let params:any = {};
                params.lat = lat;
                params.lng = lng;
                // console.log(lat);
                // console.log(lng);
                this.getLocation(params).subscribe(rep => {
                  // do something with Rep, Rep will have the data you desire.
                  this.place = rep;
                  // console.log(this.place);
                });
            },
            error => {
                switch (error.code) {
                    case 1:
                        // console.log('Permission Denied');
                        break;
                    case 2:
                        // console.log('Position Unavailable');
                        break;
                    case 3:
                        // console.log('Timeout');
                        break;
                }
            }
        );
    };
  }

  codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    this.geocoder.geocode({
      'latLng': latlng
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        // if (results[1]) {
        if (results[0]) {
          // console.log(results[1]);
          //formatted address
          let fullPlace =  results[0].formatted_address;
          //find country name
          let city;
          // city.long_name = '';
          for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //this is the object you are looking for
                city = results[0].address_components[i];
                break;
              }
            }
          }
          //city data
          // this.place = (city.long_name)? city.long_name : '';
          this.place = city.long_name;
          // console.log(this.place);
        } else {
          // alert('No results found');
        }
      } else {
        // alert('Geocoder failed due to: ' + status);
      }
    });
  }

  getLocation(params): Observable<any> {
    return Observable.create(observer => {
      var latlng = new google.maps.LatLng(params.lat, params.lng);
      this.geocoder.geocode({
        'latLng': latlng
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            let fullPlace =  results[0].formatted_address;
            //find country name
            let city;
            for (var i=0; i<results[0].address_components.length; i++) {
              for (var b=0;b<results[0].address_components[i].types.length;b++) {
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  city = results[0].address_components[i];
                  break;
                }
              }
            }
            //city data
            observer.next(city.long_name);
            observer.complete();
          } else {
            // alert('No results found');
            observer.error('No results found');
          }
        } else {
          // alert('Geocoder failed due to: ' + status);
          observer.error('Geocoder failed due to: ' + status);
        }
      });
      // if(window.navigator && window.navigator.geolocation) {
      //     window.navigator.geolocation.getCurrentPosition(
      //         (position) => {
      //             observer.next(position);
      //             observer.complete();
      //         },
      //         (error) => observer.error(error)
      //     );
      // } else {
      //     observer.error('Unsupported Browser');
      // }
    });
  }

  /**
   * Switch tabs - Future/Past meetings
   * @param tab 
   */
  selectTab(tab) {
    this.selectedTab = tab;
  }

  /**
   * Get user future meetings - NOT USING - Changed to getUserEvents function
   * @param searchParam 
   */
  getUserMeetings(searchParam = '') {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_status = '1';
    params.limit = this.limit;
    params.offset = this.offset;
    params.keyword = searchParam;
    params.route_meeting_id = this.routeMeetingId;
    if(this.autoReload){
      // this.loadMeeting = 
      this.userMeetingsListService.getUserMeetings(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              this.p = this.offset;
              this.recordDetails = response.body.records;
              this.isDataAvailable = true;
              this.meetings = response.body.meetings;
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
      );
    }else{
      this.busy = this.userMeetingsListService.getUserMeetings(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              this.p = this.offset;
              this.recordDetails = response.body.records;
              this.isDataAvailable = true;
              this.meetings = response.body.meetings;
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
      );
    }
  }

  /**
   * Generate host link while enter future meeting
   */
  generateHostLink(meetingId = ''){
    if(meetingId != ''){
      for(let i=0; i<this.meetings.length; i++){
        if(this.meetings[i].id == meetingId){
          let meetDetails = this.meetings[i];
          // let hostUrlToken = meetDetails.m_id + '*#*' + meetDetails.host_name + '*#*' + meetDetails.host_id + '*#*' + meetDetails.room_id + '*#*' + '4' + '*#*' + this.latitude + '*#*' + this.longitude + '*#*' + '0' + '*#*' + 'false';
          let hostUrlToken = meetDetails.m_id + '*#*' + meetDetails.host_name + '*#*' + meetDetails.host_id + '*#*' + meetDetails.room_id + '*#*' + '4' + '*#*' + this.latitude + '*#*' + this.longitude + '*#*' + meetDetails.is_sprout + '*#*' + 'false';
          let hostUrl = Config.HOST_URL + '?token='+btoa(hostUrlToken);
          window.open(hostUrl, '_blank');
          // Save host details
          this.saveHostDetails(meetingId);
        }
      }
    }
  }

  /**
   * Generate host url while enter past meeting
   * @param meetingId 
   */
  generatePastHostLink(meetingId = ''){
    if(meetingId != ''){
      for(let i=0; i<this.pastMeetings.length; i++){
        if(this.pastMeetings[i].id == meetingId){
          let meetDetails = this.pastMeetings[i];
          // let hostUrlToken = meetDetails.m_id + '*#*' + meetDetails.host_name + '*#*' + meetDetails.host_id + '*#*' + meetDetails.room_id + '*#*' + '4' + '*#*' + this.latitude + '*#*' + this.longitude + '*#*' + '0' + '*#*' + 'false';
          let hostUrlToken = meetDetails.m_id + '*#*' + meetDetails.host_name + '*#*' + meetDetails.host_id + '*#*' + meetDetails.room_id + '*#*' + '4' + '*#*' + this.latitude + '*#*' + this.longitude + '*#*' + meetDetails.is_sprout + '*#*' + 'false';
          let hostUrl = Config.HOST_URL + '?token='+btoa(hostUrlToken);
          window.open(hostUrl, '_blank');
          // Save host details
          // Commented - 26/03/2018
          // this.saveHostDetails(meetingId);
          // Added - 26/03/2018
          this.savePastHostDetails(meetingId);
        }
      }
    }
  }

  /**
   * Save host details while enter meeting - Latitude, longitude, location
   * @param meetingId 
   */
  saveHostDetails(meetingId = ''){
    if(meetingId != ''){
       for(let i=0; i<this.meetings.length; i++){
         if(this.meetings[i].id == meetingId){
            let hostMeeting = this.meetings[i];
            let params:any = {};
            params.token = this.userDetails.token;
            params.meeting_id = meetingId;
            params.host_id = hostMeeting.host_id;
            params.latitude = this.latitude;
            params.longitude = this.longitude;
            params.place = this.place;
            params.host_email = hostMeeting.host_email;
            this.inviteUsersService.updateInvitation(params).subscribe(
                (response:any) => {
                  response   = JSON.parse(response['_body']);
                  if(response.success==1){
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
            );
         }
       }
    }
  }

  savePastHostDetails(meetingId = ''){
    if(meetingId != ''){
       for(let i=0; i<this.pastMeetings.length; i++){
         if(this.pastMeetings[i].id == meetingId){
            let hostMeeting = this.pastMeetings[i];
            let params:any = {};
            params.token = this.userDetails.token;
            params.meeting_id = meetingId;
            params.host_id = hostMeeting.host_id;
            params.latitude = this.latitude;
            params.longitude = this.longitude;
            params.place = this.place;
            params.host_email = hostMeeting.host_email;
            this.inviteUsersService.updateInvitation(params).subscribe(
                (response:any) => {
                  response   = JSON.parse(response['_body']);
                  if(response.success==1){
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
            );
         }
       }
    }
  }

  /**
   * Get timezone abbreviation
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
   * Get user past meetings - NOT USING - Changed to getUserPastEvents function
   * @param searchParam 
   */
  getUserPastMeetings(searchParam = '') {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_status = '3';
    params.limit = this.pastLimit;
    params.offset = this.pastOffset;
    params.keyword = searchParam;
    params.route_meeting_id = this.routeMeetingId;
    if(this.autoReload){
      this.userMeetingsListService.getUserMeetings(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              this.pastP = this.pastOffset;
              this.pastRecordDetails = response.body.records;
              this.pastIsDataAvailable = true;
              this.pastMeetings = response.body.meetings;
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
      );
    }else{
      this.pastBusy = this.userMeetingsListService.getUserMeetings(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              this.pastP = this.pastOffset;
              this.pastRecordDetails = response.body.records;
              this.pastIsDataAvailable = true;
              this.pastMeetings = response.body.meetings;
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
      );
    }
  }

  /**
   * Show modal when cancel a meeting
   * @param meetingId 
   */
  cancelMeeting(meetingId) {
    if((meetingId != '') && (this.roleId == '3')) {
      for(let i=0; i<this.meetings.length; i++){
        if(this.meetings[i].id == meetingId){
          if(this.meetings[i].is_rescheduled == '1'){
            this.showFailure('Can\'t cancel rescheduled meeting');
          }else{
            this.cancelMeetingId   = meetingId;
            $("#delete-pop1").modal({'show': true});
          }
        }
      }
    }
  }

  /**
   * Cancel meeting
   * @param meetingId 
   */
  cancelScheduledMeeting(meetingId) {
    if((meetingId != '') && (this.roleId == '3')){
      this.disableCancel = true;
      let params:any = {};
      params.meeting_id = meetingId;
      params.token = this.userDetails.token;
      this.meetingService.cancelMeeting(params).subscribe(
        (response:any) => {
          this.disableCancel = false;
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            $("#delete-pop1").modal('hide');
            this.sendCancellation(params);
            // this.getUserMeetings();
            this.getUserEvents();
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          // this.showFailure($(error.message).text());
          if(error.message == 'Login failed'){
              this.user.logOut();
              this.redirectLogin();
            }else{
              this.showFailure($(error.message).text());
            }
        }
      );
    }
  }

  /**
   * Send cancellation email 
   */
  sendCancellation(params) {
    if(this.roleId == '3') {
      this.meetingService.sendCancellation(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
          }
        },
        (error) => { 
          // console.log(error);
        }
      );
    }
  }

  /**
   * Show success toastr message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  /**
   * Show error toastr message
   * @param msg 
   */
  showFailure(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Search future meetings
   */
  searchMeeting() {
    this.autoReload = false;
    // this.getUserMeetings(this.keyword);
    this.p = 1;
    this.limit = 10;
    this.offset = 1;
    this.getUserEvents(this.keyword);
  }

  /**
   * Search past meetings
   */
  searchPastMeeting() {
    // this.getUserPastMeetings(this.pastKeyword);
    this.pastP = 1;
    this.pastLimit = 10;
    this.pastOffset = 1;
    this.getUserPastEvents(this.pastKeyword);
  }

  /**
   * get meetings when future meetings pagination changes
   * @param event 
   */
  pageChanged(event) {
    this.autoReload = false;
    this.offset = event;
    // this.getUserMeetings();
    this.getUserEvents();
  }

  /**
   * Get meetings when past meetings pagination changes
   * @param event 
   */
  pastPageChanged(event) {
    this.pastOffset = event;
    // this.getUserPastMeetings();
    this.getUserPastEvents();
  }

  formatDate(date) {
    return moment(date, 'YYYY-MM-DD hh:mm:ss').format('DD MMM. YYYY, hh:mm a');
  }

  /**
   * Meeing title
   * @param value 
   */
  transform(value: string) {
    let limit = 30;
    let trail = '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
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
   * Show reschedule modal
   * @param meeting_id 
   */
  meetingReJoin(meeting_id){
    this.dateError              = false;
    this.timezoneErrorMsg       = "";
    this.invitationContentError = 0;
    this.reinvite_form.resetForm();
    $('#meetingRejoin').modal('show');
    this.meetingId              = meeting_id;
    this.getUserMeeting();
  }
  
  /**
   * Get meeting details
   */
  getUserMeeting(){
    if(this.meetingId != ''){
       let params:any           = {};
       params.meeting_id        = this.meetingId;
       params.token             = this.userDetails.token;
       params.route_meeting_id  = this.meetingId;
       this.userMeetingsListService.getUserMeeting(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.body.meeting){
            this.timezone       = response.body.meeting.timezone;
            this.meetingTitle   = response.body.meeting.meeting_title;
            this.title = response.body.meeting.meeting_title;
            this.rejoinTimezone = this.formatTimezone(this.timezone);
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          if(error.message == 'Login failed'){
            this.user.logOut();
            if(this.roleId == '1') {
              this.router.navigateByUrl('/admin/login');
            }else{
              this.router.navigateByUrl('/');
            }
          }else {
            if(this.roleId == '3'){
              // Registered user
              this.router.navigateByUrl('/meetings-list');
            }else {
              // Admin/Facilitator
              this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
            }
          }
        }
      );
    }
  }
  
  changeTimezone(value){
    if(value != ""){
      this.timezoneErrorMsg = "";
      this.rejoinTimezone   = this.formatTimezone(value);
      this.changeSchedule();
    }
  }

  /**
   * Change notification message while reschedule
   */
  changeSchedule(){
    this.invitationContent      = 'You are cordially invited to join the meeting  '+this.meetingTitle+' on '+this.rejoinDate+' '+this.rejoinTimezone+'.';
  }

  /**
   * Invite users
   * 
   * @param event 
   * @param invitation 
   */
  meetingInviteUsers(event, invitation:NgForm) {
    let errors = 0;
    if(!invitation.form.controls.schedule_date.valid){
      this.dateError = true;
      errors++;
    }else{
      this.dateError = false;
    }
    if(this.timezone == ""){
      this.timezoneErrorMsg   = 'Please select timezone';
      errors++;
    }
    if(this.invitationContent != ''){
      this.invitationContentError = 0;
    }else{
      errors++;
      this.invitationContentError = 1;
    }
    if(errors > 0){
    }else{
      let formData:FormData = new FormData();
      let params:any = {};
      params.token            = this.userDetails.token;
      params.meeting_id       = this.meetingId;
      params.meeting_role_id  = this.roleId;
      params.user_emails      = invitation.value.userEmails;
      params.invitation_content = invitation.value.invitationContent;
      params.scheduled_date   = this.schedule_date;
      params.timezone         = this.timezone;
      this.userMeetingsListService.meetingRejoin(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            $('#meetingRejoin').modal('hide');
            invitation.resetForm();
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          this.showFailure(error.message);
          if(error.message == 'Login failed'){
            this.user.logOut();
            // this.router.navigateByUrl('/');
            if(this.roleId == '1') {
              this.router.navigateByUrl('/admin/login');
            }else{
              this.router.navigateByUrl('/');
            }
          }
        }
      );
    }
  }

  /**
   * Get user future meetings
   * @param searchParam 
   */
  getUserEvents(searchParam = '') {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_status = '1';
    params.limit = this.limit;
    params.offset = this.offset;
    params.keyword = this.keyword;
    params.route_meeting_id = this.routeMeetingId;
    if(this.autoReload){
      this.userMeetingsListService.getUserEvents(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              response.body.event_type = 1; // Future meetings
              this.processEvents(response.body);
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
      );
    }else{
      this.busy = this.userMeetingsListService.getUserEvents(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              response.body.event_type = 1; // Future meetings
              this.processEvents(response.body);
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
      );
    }
  }

  /**
   * Process user events
   */
  processEvents(eventsData) {
    let records = eventsData.records;
    let meetings = eventsData.meetings;
    let attendance = eventsData.attendance;
    // Changed - 08/03/2018 - Watched recordings
    // let recordings = eventsData.recordings;
    let event_type = eventsData.event_type;
    for(let i=0; i<meetings.length; i++){
      let meetingAttendance = attendance.filter(p => p.meeting_id == meetings[i].id);
      meetings[i].reg_users_count = 0;
      meetings[i].attendees_count = 0;
      // Added - 08/03/2018 - Watched recordings
      meetings[i].recordings_view = 0;
      if (typeof meetingAttendance !== 'undefined' && meetingAttendance.length > 0) {
        if(meetingAttendance[0].registered){
          meetings[i].reg_users_count = meetingAttendance[0].registered;
        }
        if(meetingAttendance[0].attended){
          meetings[i].attendees_count = meetingAttendance[0].attended;
        }
        // Added - 08/03/2018 - Watched recordings
        if(meetingAttendance[0].watched){
          meetings[i].recordings_view = meetingAttendance[0].watched;
        }
      }
      // Changed - 08/03/2018 - Watched recordings
      // let meetingRecording = recordings.filter(p => p.meeting_id == meetings[i].id);
      // meetings[i].recordings_view = 0;
      // if(typeof meetingRecording !== 'undefined' && meetingRecording.length > 0) {
      //   if(meetingRecording[0].watched){
      //     meetings[i].recordings_view = meetingRecording[0].watched; 
      //   }
      // }
    }
    if(event_type == 2){ // Past meetings
      this.pastP = this.pastOffset;
      this.pastRecordDetails = records;
      this.pastIsDataAvailable = true;
      this.pastMeetings = meetings;
    }else{ // Future meetings
      this.p = this.offset;
      this.recordDetails = records;
      this.isDataAvailable = true;
      this.meetings = meetings;
    }
  }

  /**
   * Get user past meetings
   * @param searchParam
   */
  getUserPastEvents(searchParam = '') {
    let params:any = {};
    params.token = this.userDetails.token;
    params.meeting_status = '3';
    params.limit = this.pastLimit;
    params.offset = this.pastOffset;
    // params.keyword = searchParam;
    params.keyword = this.pastKeyword;
    params.route_meeting_id = this.routeMeetingId;
    if(this.autoReload){
      this.userMeetingsListService.getUserEvents(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              response.body.event_type = 2; // Past meetings
              this.processEvents(response.body);
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
      );
    }else{
      this.pastBusy = this.userMeetingsListService.getUserEvents(params).subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success==1){
              response.body.event_type = 2; // Past meetings
              this.processEvents(response.body);
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
      );
    }
  }

  /**
   * Reinvite / Reschedule meeting
   * @param event 
   * @param invitation 
   * @date 2018-03-12
   */
  reInvite(event, invitation:NgForm) {
    let errors = 0;
    if(!invitation.form.controls.schedule_date.valid){
      this.dateError = true;
      errors++;
    }else{
      this.dateError = false;
    }
    if(this.timezone == ""){
      this.timezoneErrorMsg   = 'Please select timezone';
      errors++;
    }
    if(this.invite_users == 1){
      if(this.invitationContent != ''){
        this.invitationContentError = 0;
      }else{
        errors++;
        this.invitationContentError = 1;
      }
    }
    if(this.title == ""){
      errors++;
    }
    if(errors > 0){
    }else{
      let formData:FormData = new FormData();
      let params:any = {};
      params.token            = this.userDetails.token;
      params.meeting_id       = this.meetingId;
      params.meeting_title    = this.title;
      params.meeting_role_id  = this.roleId;
      params.invitation_content = invitation.value.invitationContent;
      params.scheduled_date   = this.schedule_date;
      params.timezone         = this.timezone;
      if(this.invite_users){
        params.invite_users   = 1;
      }else{
        params.invite_users   = 2;
      }
      this.userMeetingsListService.reInvite(params).subscribe(
        (response:any) => {
          response = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            $('#meetingRejoin').modal('hide');
            // Redirects to general info page
            this.router.navigateByUrl(this.urlPrefix + '/meetings/general-info/' + this.meetingId);
            invitation.resetForm();
            // Commented - redirects to general info page
            // Load future meetings
            // this.getUserEvents();
            // Load past meetings
            // this.getUserPastEvents();
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          this.showFailure(error.message);
          if(error.message == 'Login failed'){
            this.user.logOut();
            this.redirectLogin();
          }else{
            this.redirectHome();
          }
        }
      );
    }
  }


 
}
