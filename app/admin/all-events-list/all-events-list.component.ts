import { Component, OnInit } from '@angular/core';
import { Config } from "app/config/config";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AllEventsListService } from 'app/admin/all-events-list/all-events-list.service';
import * as moment from 'moment';
import 'moment-timezone';

declare var $:any;

@Component({
  selector: 'app-all-events-list',
  templateUrl: './all-events-list.component.html',
  styleUrls: ['./all-events-list.component.css'],
  providers: [AllEventsListService]
})
export class AllEventsListComponent implements OnInit {

  public events:any = [];

  constructor(private allEventsListService: AllEventsListService) { }

  ngOnInit() {
    /* calendar */
    $('#calendar').fullCalendar({
      // timezone: 'local',
      timeFormat: 'hh:mm a',
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
      dayRender: function(date, cell) {
          cell.css("background-color", "#f7f8fd");
      },
      more:true,
      eventSources: [{
          events: (start, end, timezone, callback)=> {
              let params:any = {};
              params.start = start.unix();
              params.end = end.unix();
              this.allEventsListService.getEventsCalendar(params).subscribe(
                (response:any) => {
                    response = JSON.parse(response['_body']);
                    if(response.success == 1){
                        // this.processEvents(response.body.meetings);
                        callback(this.events);
                    }
                },
                (error) => {
                }
              )
          }
      }],
        
    });
  }

}
