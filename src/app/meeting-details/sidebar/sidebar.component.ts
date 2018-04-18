import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/shared/user';
declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public meetingId;
  public userDetails;
  public roleId;
  public urlPrefix = '';
  
  @Input() meetingStatus: string;
  @Input() isRescheduled: boolean;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user: User) { 
    this.userDetails = user.getUser();
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.meetingId   = params['meetingId'];
    });
    // console.log(this.urlPrefix);

    $(document).ready(function() {

      $(document).on("click", ".puller-wrap", function(){
          $(".puller-wrap svg").each(function() {
              if ($(".puller-wrap svg").css('display') == 'none') {
                  $(this).css("display", "block");
              } else {
                  $(this).css("display", "none");
              }
          });
          $(".left-sidebar-wrap").toggleClass("left-sidebar-wrap-puller");
      });
    });
    
  }

}
