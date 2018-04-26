import { Component, OnInit ,Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventsCalendarService } from 'app/admin/events-calendar/events-calendar.service';
import { InviteUsersService } from 'app/meeting-details/invite-users/invite-users.service';
import { MeetingService } from 'app/meeting/meeting.service';
import { ToastrService } from 'toastr-ng2';
import { User } from 'app/shared/user';
import { Config } from "app/config/config";
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import _ from "lodash";
import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;
// declare var moment:any;
declare var google;

@Component({
  selector: 'app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.css'],
  providers: [EventsCalendarService, MeetingService, InviteUsersService]
})

export class EventsCalendarComponent implements OnInit {

    events:any = [];
    public userDetails:any = {};
    public eventDate = '';
    public eventList:any = [];
    public loadEvent = 0;
    public roleId;
    public urlPrefix = '';
    public cancelMeetingId   = '';
    public limit = 10;
    public offset = 1;
    public startDate;
    public recordDetails:any = [];
    p: number = 1;
    busy: Subscription;
    public requestsCount:number = 0;
    public autoReload:boolean = false;
    public interval;
    public geolocationPosition;
    public geocoder;
    public latitude = 0.000000;
    public longitude = 0.000000;
    public sprout = 0;
    public place = '';
    
    constructor(private router:Router, private activatedRoute:ActivatedRoute, private user: User, public eventsCalendarService: EventsCalendarService, private meetingService: MeetingService, private inviteUsersService:InviteUsersService, private toastrService: ToastrService) { 
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

      this.geocoder = new google.maps.Geocoder();
      this.getGeoLocation();

      // console.log(moment().unix());
      let params:any = {};
      params.start = moment().unix();
      params.token = this.userDetails.token;
      this.startDate = moment().unix();
      this.getMeetingsDay(params);
      // let __this = this;
      // $(document).on("click", ".fc-today-button", function() {
      //   alert();
      //   __this.getMeetingsDay(params);
      // });

      // $(document).on('click', ".fc-view-container td", function() {
      //   $('html,body').animate({scrollTop: $(".table-not-overflow").offset().top},'slow');
      // })

      this.interval = setInterval(() => {
        let params:any = {};
        params.start = this.startDate;
        params.token = this.userDetails.token;
        this.autoReload = true;
        this.getMeetingsDay(params);
      }, 1000 * 60);
    }

    ngOnDestroy() {
      if (this.interval) {
          clearInterval(this.interval);
      }
    }

    calendarOptions(){
        let calendarOptions:Object = {
            default: 'bootstrap3',
            header: {
                left: 'prev,next today',
                center: 'prevYear,title,nextYear',
                // right: 'month,agendaWeek,agendaDay,listWeek'
            },
            views: {
                month: {
                    columnFormat: 'dddd'
                }
            },
            //eventLimit: true,
            eventLimit: 2,
            defaultDate: new Date(),
            editable: true,
            eventSources: [{
                events: (start, end, timezone, callback)=> {
                    let params:any = {};
                    params.start = start.unix();
                    params.end = end.unix();
                    params.token = this.userDetails.token;
                    this.eventsCalendarService.getMeetingsCalendar(params).subscribe(
                      (response:any) => {
                          response = JSON.parse(response['_body']);
                          if(response.success == 1){
                              this.processEvents(response.body.meetings);
                              callback(this.events);
                          }
                      },
                      (error) => {
                      }
                    )
                }
            }],
            eventRender: function(event, element) {
                element.find('.fc-title').append(event.description);
                element.find('.fc-event-title').html(event.title);
            },
            eventClick: (event, jsEvent, view) => {
                let params:any = {};
                params.start = (event.start).unix();
                params.token = this.userDetails.token;
                this.startDate = (event.start).unix();
                this.getMeetingsDay(params);
            },
            dayClick: (date, jsEvent, view) => {
                // console.log(date);
                // console.log(date.unix());
                let params:any = {};
                params.start = date.unix();
                params.token = this.userDetails.token;
                this.startDate = (date).unix();
                this.getMeetingsDay(params);
                $("html, body").animate({
                    scrollTop: $(document).height()
                }, 1000);
            },
        };
        return(calendarOptions);
    }

    getGeoLocation() {
    if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                this.geolocationPosition = position;
                // ,
                    // console.log(position);
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;
                    // this.codeLatLng(lat, lng);

                    let params:any = {};
                    params.lat = lat;
                    params.lng = lng;
                  //   this.userMeetingsListService.getLocation(params).subscribe(rep => {
                  //     // do something with Rep, Rep will have the data you desire.
                  //     console.log(rep);
                  //  });

                   this.getLocation(params).subscribe(rep => {
                      // do something with Rep, Rep will have the data you desire.
                      // console.log(rep);
                      this.place = rep;
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
          console.log(this.place);
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
   * Get daily meetings for admin/facilitator calendar view
   * 
   * @author Paul P Elias
   * @date 2017-11-08
   */
  getMeetingsDay(params) {
    params.limit = this.limit;
    params.offset = this.offset;
    params.start = this.startDate;
    params.token = this.userDetails.token;
    if(this.autoReload){
      this.eventsCalendarService.getMeetingsDay(params).subscribe(
          (response:any) => {
              response = JSON.parse(response['_body']);
              if(response.success == 1){
                  this.loadEvent = 1;
                  this.eventDate = response.body.scheduled_date;
                  this.eventList = response.body.meetings;
                  this.p = this.offset;
                  this.recordDetails = response.body.records;
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
    }else{
      this.busy = this.eventsCalendarService.getMeetingsDay(params).subscribe(
          (response:any) => {
              response = JSON.parse(response['_body']);
              if(response.success == 1){
                  this.loadEvent = 1;
                  this.eventDate = response.body.scheduled_date;
                  this.eventList = response.body.meetings;
                  this.p = this.offset;
                  this.recordDetails = response.body.records;
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


  generateHostLink(meetingId = ''){
    if(meetingId != ''){
      for(let i=0; i<this.eventList.length; i++){
        if(this.eventList[i].id == meetingId){
          let meetDetails = this.eventList[i];
          // let hostUrlToken = meetDetails.m_id + '*#*' + meetDetails.host_name + '*#*' + meetDetails.host_id + '*#*' + meetDetails.room_id + '*#*' + '4' + '*#*' +'0.000000' + '*#*' + '0.000000' + '*#*' +'0';
          let hostUrlToken = meetDetails.m_id + '*#*' + meetDetails.host_name + '*#*' + meetDetails.host_id + '*#*' + meetDetails.room_id + '*#*' + '4' + '*#*' + this.latitude + '*#*' + this.longitude + '*#*' + '0'  + '*#*' + 'false';
          // Changed - 11/01/2018 - open in new tab
          // return Config.HOST_URL + '?token='+btoa(hostUrlToken);
          let hostUrl = Config.HOST_URL + '?token='+btoa(hostUrlToken);
          window.open(hostUrl, '_blank');
          // Save host details
          this.saveHostDetails(meetingId);
        }
      }
    }
  }

  saveHostDetails(meetingId = ''){
    // console.log(this.place+'place');
    if(meetingId != ''){
       for(let i=0; i<this.eventList.length; i++){
         if(this.eventList[i].id == meetingId){
            let hostMeeting = this.eventList[i];
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

  pageChanged(event) {
    this.offset = event;
    let params:any = {};
    this.getMeetingsDay(params);
  }

  /**
   * Group and filter events
   * 
   * @param eventsList 
   * @date 2017-11-08
   * @author Paul P Elias
   */
  processEvents(eventsList) {
    this.events = [];
    // eventsList[0].attendees_count = 2400;
    // Group meetings by scheduled date
    let grouped = _.mapValues(_.groupBy(eventsList, 'scheduled_date'));
    for(let key in grouped){
        // Find meetings with more than 2000 attendees
        let eventAttendees = _.filter(grouped[key], function(v) { return v.attendees_count > 2000 });
        if(eventAttendees.length > 0){
            let event:any = {};
            event.title = '';
            event.start = key;
            // event.borderColor = 'rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) #e91e63'; // Changed - 22/11/2017
            event.borderColor = 'rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) #e91e63a8';
            event.textColor = '#000000';
            // event.backgroundColor = 'rgba(233, 30, 99, 0.17)';
            // event.backgroundColor = 'rgba(233, 30, 99, 0.53)'; // Changed - 22/11/2017
            event.backgroundColor = 'rgba(233, 30, 99, 0.27)';
            event.description = '2000+ Attendees';
            if(eventAttendees.length > 1){
                event.description += ' (X'+eventAttendees.length+')'; 
            }
            this.events.push(event);
            event = {};
            event.start = key;
            event.end = key;
            event.overlap = false;
            event.rendering = 'background';
            // event.color = 'rgba(101, 193, 108, 0.28)';
            // event.color = 'rgb(25, 189, 38)'; // Changed - 22/11/2017
            // event.color = '#03a9f4c9';
            event.color = 'rgba(3, 169, 244, 0.62)';
            this.events.push(event);
        }else{
            let event:any = {};
            event.start = key;
            event.end = key;
            event.overlap = false;
            event.rendering = 'background';
            // event.color = 'rgba(101, 193, 108, 0.28)';
            // event.color = 'rgb(25, 189, 38)'; // Changed - 22/11/2017
            // event.color = '#03a9f4c9';
            event.color = 'rgba(3, 169, 244, 0.62)';
            this.events.push(event);
        }
    }
  }
  
  cancelMeeting(meetingId) {
    if(meetingId != '') {
      this.cancelMeetingId   = meetingId;
      $("#delete-pop1").modal({'show': true});
    }
  }
 
  cancelScheduledMeeting(meetingId) {
    if(meetingId != ''){
      let params:any = {};
      params.meeting_id = meetingId;
      params.token = this.userDetails.token;
      this.meetingService.cancelMeeting(params).subscribe(
        (response:any) => {
          response   = JSON.parse(response['_body']);
          if(response.success == 1){
            this.showSuccess(response.message);
            this.removeMeeting(meetingId);
            $("#delete-pop1").modal('hide');
            this.sendCancellation(params);
          }
        },
        (error) => { 
          error = JSON.parse(error['_body']);
          this.showError($(error.message).text());
        }
      );
    }
  }

  removeMeeting(meetingId){
    for(let i=0; i<this.eventList.length; i++) {
      if(this.eventList[i].id == meetingId) {
        this.eventList.splice(i, 1);
      }
    }
  }

  sendCancellation(params) {
    this.meetingService.sendCancellation(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
        }
      },
      (error) => { 
        console.log(error);
      }
    );
  }

  newWindow(event) {
    // height=570,width=520,
    window.open(document.URL, '_blank', 'location=yes,scrollbars=yes,status=yes,fullscreen=yes');
  }

  formatTime(recDate) {
    return moment(recDate, 'hh:mm:ss').format('hh.mm A');
  }

  formatEventDate(eventDate) {
    return moment(eventDate, 'YYYY-MM-DD hh:mm:ss').format('dddd , DD MMMM');
  }

  showError(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  countChangedHandler(value){
    this.requestsCount = value;
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

  transform(value: string) {
    let limit = 30;
    let trail = '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
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

}
