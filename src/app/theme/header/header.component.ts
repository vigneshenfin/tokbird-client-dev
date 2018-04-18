import { Component, OnInit } from '@angular/core';
import {Injectable,EventEmitter} from '@angular/core';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { User } from "app/shared/user";
import { Config } from "app/config/config";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userDetails;
  public userId;
  public us_image;
  public roleId;
  public defaultImgPath;
  public urlPrefix = '';
  public logo_img:any = "";
  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:User) {
    this.userDetails = user.getUser();
    this.userId      = this.userDetails.id;
    this.roleId      = this.userDetails.us_role_id;
    this.logo_img    = this.userDetails.logo_image;
    // console.log(this.logo_img)
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      this.urlPrefix = '/facilitator';
    }
    this.defaultImgPath = Config.BASE_API_URL+'assets/uploads/user/default.jpg';
   }

  ngOnInit() {
    if(this.userDetails.us_image){
      this.us_image    = this.userDetails.us_image;
    }
    this.user.updateProPicEvent.subscribe(
       (pic) => this.changePic(pic)
    );

    this.user.updateLogoEvent.subscribe(
       (pic) => this.changeLogo(pic)
    );
  }
  onLogout(){
    this.user.logOut();
    this.router.navigateByUrl('/');
    
  }

  changePic(pic){
    this.us_image = pic;
  }

  changeLogo(pic){
    this.logo_img = pic;
  }
}
