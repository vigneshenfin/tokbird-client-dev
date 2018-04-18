import { Component, OnInit , Input} from '@angular/core';
import { ReportsService } from 'app/reports/reports.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ReportsService]
})
export class DashboardComponent implements OnInit {
  @Input() dashboardDetails:any;
  @Input() routeMeetingId;
  @Input() mIds;
  // Added - 17/04/2018
  @Input() dashboardBusy;
  public dashboardData:any = [];
  public totalQ = 0;
  public answeredQ = 0;

  constructor(private reportsService: ReportsService) { }

  ngOnInit() {
    this.dashboardData = this.dashboardDetails;
  }

  ngOnChanges() {
    this.dashboardData = this.dashboardDetails;
    // this.getQuestionsCount();
  }

  getQuestionsCount() {
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
          },
        (error) => {
        }
      )
    }
  }

}
