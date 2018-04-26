import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserMeetingsListService } from 'app/user-meetings/user-meetings-list/user-meetings-list.service';
import { User } from 'app/shared/user';
import _ from "lodash";
import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;
// declare var moment;


@Component({
  selector: 'app-meetings-calendar-view',
  templateUrl: './meetings-calendar-view.component.html',
  styleUrls: ['./meetings-calendar-view.component.css'],
  providers: [UserMeetingsListService]
})
export class MeetingsCalendarViewComponent implements OnInit {

  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public userDetails:any = {};
  events:any = [];
  public meeting:any = {};

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user: User, private userMeetingsListService: UserMeetingsListService, private toastrService: ToastrService) { 
    this.userDetails   = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['meetingId']){
        this.routeMeetingId = params['meetingId'];
      }
    });

    /* calendar */
    $('#calendar').fullCalendar({
        default: 'bootstrap3',
        dayRender: function(date, cell) {
            cell.css("background-color", "#f7f8fd");
        },
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        views: {
            month: {
                columnFormat: 'dddd'
            }
        },

        eventLimit: 4,
        more:true,
        
        eventSources: [{
            events: (start, end, timezone, callback)=> {
                let params:any = {};
                params.start = start.unix();
                params.end = end.unix();
                params.token = this.userDetails.token;
                params.route_meeting_id = this.routeMeetingId;
                this.userMeetingsListService.getUserMeetingsCalendar(params).subscribe(
                  (response:any) => {
                      response = JSON.parse(response['_body']);
                      if(response.success == 1){
                          this.processEvents(response.body.meetings);
                          callback(this.events);
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
        }],
        eventClick: (event, jsEvent, view) => {
            let params:any = {};
            params.meeting_id = event.id;
            params.token = this.userDetails.token;
            params.route_meeting_id = this.routeMeetingId;
            this.userMeetingsListService.getUserMeeting(params).subscribe(
              (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success==1){
                  // console.log(response.body.meeting);
                  this.meeting = response.body.meeting;
                  this.processMeetingInfo(response.body.meeting);
                  $('.modalTitle').html(event.title);
                  $('#calendarModal').modal({'show':true});
                }
              },
              (error) => {
                error   = JSON.parse(error['_body']);
                if(error.message == 'Login failed'){
                  this.user.logOut();
                  this.redirectLogin();
                }else{
                  this.redirectHome();
                }
              }
            )
            
        },
    });
    
  }

  ngOnChanges() {
  }

  /**
   * Manage events
   * 
   * @param eventsList 
   * @date 2017-11-21
   * @author Paul P Elias
   */
  processEvents(eventsList) {
    this.events = [];
    for(let i=0; i<eventsList.length; i++){
      let event:any = {};
      event.id = eventsList[i].meeting_id;
      let title = '';
      if((eventsList[i].meeting_title).length > 11){
        // title = (eventsList[i].meeting_title).substring(0, 10) + '..';
        title = (eventsList[i].meeting_title).substring(0, 11);
      }else{
        title = eventsList[i].meeting_title;
      }
      event.title = title + ' : ' + eventsList[i].invitees_count;
      event.start = eventsList[i].scheduled_date;
      event.textColor = '#000000';
      // event.backgroundColor = '#c3f3c7'; // Changed - 22/11/2017
      // event.backgroundColor = '#03a9f452';
      event.backgroundColor = 'rgba(73, 169, 245, 0.41)';
      // event.borderColor = 'rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) #65c16c'; // Changed - 22/11/2017
      event.borderColor = 'rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) #03a9f4';
      this.events.push(event);
    }
  }

  processMeetingInfo(meetingDetails)
  {
    let emailReminders = JSON.parse(meetingDetails['email_reminders']);
    let meetingDuration = this.hhmmss(meetingDetails['meeting_duration']);
    let durationHours = meetingDuration['hours'];
    let durationMinutes = meetingDuration['minutes'];
    this.meeting.duration_hours = durationHours;
    this.meeting.duration_minutes = durationMinutes;
    let entryDuration = this.hhmmss(meetingDetails['allotted_entry_duration']);
    let entryHours = entryDuration['hours'];
    let entryMinutes = entryDuration['minutes'];
    this.meeting.entry_hours = entryHours;
    this.meeting.entry_minutes = entryMinutes;
    let rems = _.orderBy(emailReminders, ['seconds'],['asc']); // Use Lodash to sort array by 'name'
    for(let i = 0; i < rems.length; i++){
      if(rems[i].type == "1"){
        rems[i].duration_type = "minutes";
      }else if(rems[i].type == "2"){
        rems[i].duration_type = "hours";
      }else if(rems[i].type == "3"){
        rems[i].duration_type = "days";
      }else if(rems[i].type == "4"){
        rems[i].duration_type = "weeks";
      }
    }
    this.meeting.reminders = rems;
    this.meeting.scheduled_date = moment(meetingDetails['meeting_date_time'], 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY [at] hh:mm a');
  }

  pad(num) {
    return ("0"+num).slice(-2);
  }

  hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs%60;
    let hours = Math.floor(minutes/60)
    minutes = minutes%60;
    // return this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(secs);
    let response:any = {};
    response.minutes = minutes;
    response.hours = hours;
    response.seconds = secs;
    return response;
  }

  copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr('data-copy-url')).select();
    document.execCommand("copy");
    $temp.remove();
    this.showSuccess('Copied');
  }

  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  closeModal() {
    $('#calendarModal').modal('hide');
  }

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

  // Added - 16/11/2017
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
