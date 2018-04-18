import { Component, OnInit } from '@angular/core';
import { CalendarViewService } from 'app/meeting/meetings-list/calendar-view/calendar-view.service'
import { User } from 'app/shared/user';
import { MeetingService } from 'app/meeting/meeting.service';
import { ToastrService } from 'toastr-ng2';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { Observable } from 'rxjs/observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/throw';
declare var $:any;
declare var moment: any;
declare var Clipboard:any;
@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  providers: [CalendarViewService, MeetingService]
})
export class CalendarViewComponent implements OnInit {
  
  // public events: any = [];
  public eventsArray:any = [];
  public userDetails;
  public meeting:any = {};
  public reminderTypes = [" ", "minutes", "hours", "days", "weeks"];
  constructor(private user: User, private calendarViewService: CalendarViewService, private meetingService: MeetingService, private toastrService: ToastrService, private router:Router) {
    this.userDetails   = user.getUser();
  }

  ngOnInit() {
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    let thisKeyword = this;
    $(document).ready(function(){
      /* calendar */
            $('#calendar').fullCalendar({
                String,
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

                // defaultDate: moment().format("YYYY-MM-DD"),
                defaultDate: new Date(),
                editable: true,
                // fixedWeekCount :false,

                eventSources: [{
                    // events: this.eventsArray,
                  events: (start, end, timezone, callback)=> {
                    //   test.eventsArray = test.calendarViewService.getMonthlyEvents('test');
                    //   console.log(test.eventsArray);
                    //   callback(test.eventsArray);
                    // test.calendarViewService.getMonthlyEvents('test')
                    //   .subscribe(res => callback(res)); // just call callback
                    // test.calendarViewService.getMonthlyEvents();
                    let month = start.format("MM");
                    let year = start.format("YYYY");
                    console.log(month, year);
                    let params:any = {};
                    params.start = start;
                    params.end = end;
                    params.token = thisKeyword.userDetails.token;
                    thisKeyword.calendarViewService.getMonthlyMeetings(params)
                        .subscribe((response:any) => {
                            console.log(response);
                            response   = JSON.parse(response['_body']);
                            if(response.success==1){
                                callback(response.body.meetings);
                            }
                        });
                  }
                    }
                    // any other event sources...
                ],
                eventClick: function(event, jsEvent, view) {
                    console.log(event.id);
                    let params:any = {};
                    params.meeting_id = event.id;
                    params.token = thisKeyword.userDetails.token;
                    thisKeyword.meetingService.getMeeting(params)
                        .subscribe((response:any) => {
                            response   = JSON.parse(response['_body']);
                            if(response.success==1){
                                let meetingDetails = response.body.meeting;
                                thisKeyword.meeting.meetingId = meetingDetails.meeting_id;
                                thisKeyword.meeting.title = meetingDetails.title;
                                thisKeyword.meeting.agenda = meetingDetails.agenda;
                                thisKeyword.meeting.durationHours = meetingDetails.duration_hours;
                                thisKeyword.meeting.durationMinutes = meetingDetails.duration_minutes;
                                thisKeyword.meeting.entryHours = meetingDetails.entry_hours;
                                thisKeyword.meeting.entryMinutes = meetingDetails.entry_minutes;
                                thisKeyword.meeting.presentersUrl = meetingDetails.presenters_url;
                                thisKeyword.meeting.attendeesUrl = meetingDetails.attendees_url;
                                thisKeyword.meeting.expertsUrl = meetingDetails.experts_url;
                                thisKeyword.meeting.remindersArray = meetingDetails.reminders;
                                thisKeyword.meeting.schDate = meetingDetails.sch_date;
                                thisKeyword.meeting.schTime = meetingDetails.sch_time;
                                thisKeyword.meeting.timezone = meetingDetails.timezone;
                                thisKeyword.meeting.accessCode = meetingDetails.access_code;
                                $('.modalTitle').html(event.title);
                                $('#calendarModal').modal({'show':true});
                            }
                    },
                    (error) => {
                    });

                },
            });

      $('button').tooltip({
        trigger: 'click',
        placement: 'bottom'
      });
      
      function setTooltip(btn, message) {
        $(btn).tooltip('hide')
          .attr('data-original-title', message)
          .tooltip('show');
      }
      
      function hideTooltip(btn) {
        setTimeout(function() {
          $(btn).tooltip('hide');
        }, 1000);
      }
      
      // Clipboard
      
      var clipboard = new Clipboard('button');
      
      clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
        e.clearSelection();
      });
      
      clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
      });
    });

  }
  ngOnChanges() {
  }

  ngAfterViewInit() {
    
  }

  getMonthlyMeetings() {
    let eventsList = this.calendarViewService.getMonthlyEvents('test');
    console.log(eventsList);
  }

  copyToClipboard(element) {
    // console.log(element);
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr('data-copy-url')).select();
    // console.log($(element).attr('data-copy-url'));
    document.execCommand("copy");
    $temp.remove();
    this.showSuccess('Copied');
    // $(element+'-msg').text('Copied successfully.').fadeOut(3000);
    // $(element+'-msg').text('Copied successfully').fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
  }

  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  

}
