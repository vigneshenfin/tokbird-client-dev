import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-meeting-dashboard',
  templateUrl: './meeting-dashboard.component.html',
  styleUrls: ['./meeting-dashboard.component.css']
})
export class MeetingDashboardComponent implements OnInit {

  @Input() dashboardDetails:any;
  @Input() dashboardBusy;


  public dashboardData:any = [];

  constructor() { }

  ngOnInit() {
    console.log(this.dashboardBusy);
    this.dashboardData = this.dashboardDetails;
  }

  ngOnChanges() {
    this.dashboardData = this.dashboardDetails;
  }

}
