import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { AllEventsCalendarService } from 'app/admin/all-events-calendar/all-events-calendar.service';
import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;

@Component({
  selector: 'app-all-events-calendar',
  templateUrl: './all-events-calendar.component.html',
  styleUrls: ['./all-events-calendar.component.css'],
  providers: [AllEventsCalendarService]
})
export class AllEventsCalendarComponent implements OnInit {

  public events:any = [];
  public event:any = {};

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private allEventsCalendarService: AllEventsCalendarService, private toastrService: ToastrService) { }

  
  ngOnInit() {

    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    
    /* calendar */
    $('#calendar').fullCalendar({
        timeFormat: 'hh:mm a',
        // timezone: 'local',
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
              this.allEventsCalendarService.getEvents(params).subscribe(
                (response:any) => {
                    response = JSON.parse(response['_body']);
                    if(response.success == 1){
                        this.processEvents(response.body.meetings);
                        callback(this.events);
                    }
                },
                (error) => {
                  error = JSON.parse(error['_body']);
                  this.redirectHome();
                }
              )
            }
        }],
        eventClick: (event, jsEvent, view) => {
          let params:any = {};
            params.meeting_id = event.id;
            this.allEventsCalendarService.getEvent(params).subscribe(
              (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success==1){
                  this.event = response.body.meeting;
                  this.processEvent(response.body.meeting);
                  $('.modalTitle').html(event.title);
                  $('#calendarModal').modal({'show':true});
                }
              },
              (error) => {
                error = JSON.parse(error['_body']);
                this.redirectHome();
              }
            )
        },
    });
  }

  processEvents(eventsList) {
    this.events = [];
    for(let i=0; i<eventsList.length; i++){
      let event:any = {};
      event.id = eventsList[i].meeting_id;
      let title = '';
      let facilitatorName = '';
      if(eventsList[i].facilitator){
        facilitatorName = ' (' + eventsList[i].facilitator + ')';
      }
      // title = eventsList[i].meeting_title + ' : ' + eventsList[i].invitees_count  + facilitatorName ;
      title = eventsList[i].meeting_title + ' : ' + eventsList[i].pre_registered  + facilitatorName ;
      event.title = title;
      event.start = eventsList[i].scheduled_date;
      // let eventStart = moment(eventsList[i].scheduled_date_utc).format();
      // event.start = eventStart;
      event.textColor = '#000000';
      event.backgroundColor = 'rgba(73, 169, 245, 0.41)';
      event.borderColor = 'rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) rgba(255, 0, 0, 0) #03a9f4';
      this.events.push(event);
    }
  }

  /**
   * Process single event
   * @param event 
   */
  processEvent(event) {
    let meetingDuration = this.hhmmss(event['meeting_duration']);
    let durationHours = meetingDuration['hours'];
    let durationMinutes = meetingDuration['minutes'];
    this.event.duration_hours = durationHours;
    this.event.duration_minutes = durationMinutes;
    this.event.scheduled_date = moment(event['meeting_date_time'], 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY [at] hh:mm a');
  }

  hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs%60;
    let hours = Math.floor(minutes/60)
    minutes = minutes%60;
    let response:any = {};
    response.minutes = minutes;
    response.hours = hours;
    response.seconds = secs;
    return response;
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

  redirectHome()
  {
    this.router.navigateByUrl('/');
  }

}
