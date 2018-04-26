import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/user';
import { ListViewService } from 'app/meeting/meetings-list/list-view/list-view.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { SocialLoginComponent } from 'app/social-login/social-login.component';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrls: ['./meetings-list.component.css'],
  providers:[ListViewService]
})

export class MeetingsListComponent implements OnInit {
  public selectedTab = '';
  public userDetails;
  public meetingParams:any = {};
  public childData : any;
  // private socialLoginComponent:SocialLoginComponent;
  constructor(private user:User, private listViewService:ListViewService, private router:Router) {
    this.userDetails = user.getUser();
  }

  ngOnInit() {
    this.childData = [];
    this.selectedTab = 'list-view';
  }

  loadView(view) {
    this.selectedTab = view;
    this.getMeetings('test');
  }

  getMeetings(params:any) {
    this.meetingParams.token = this.userDetails.token;
    this.listViewService.getMeetings(this.meetingParams).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success==1){
          this.childData = response.body.meetings;
        }
      },
      (error) => {
        // console.log(error)
        error = JSON.parse(error['_body']);
        if(error.message == 'Login failed'){
          // this.socialLoginComponent.logout();
          this.user.logOut();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

}
