import { Component, OnInit,Output,ViewContainerRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomainSettingsService } from './domain-settings.service';
import { NgForm } from '@angular/forms';
import { User } from 'app/shared/user';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
declare var $:any;
@Component({
  selector: 'app-domain-settings',
  templateUrl: './domain-settings.component.html',
  styleUrls: ['./domain-settings.component.css'],
  providers: [DomainSettingsService]
})
export class DomainSettingsComponent implements OnInit {

  // Added - 16/11/2017
  public userDetails;
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  files : FileList; 
  public logo_image;
  public fileExtension;
  public prof_pic_error;
  public logo_img;
  public upload_image_name;
  public details:any   = {};
  public token;
  public domainEmail:any = "";
  public domainName:any = ""; 
  public domainId:any = "";
  public errorMsg:any = "";
  constructor( public toastr: ToastsManager,private vcr: ViewContainerRef,private router:Router, private activatedRoute:ActivatedRoute, private user:User, private domainSettingsService: DomainSettingsService) { 
    this.userDetails   = user.getUser();
    this.toastr.setRootViewContainerRef(vcr);
    this.roleId = this.userDetails.us_role_id;
    this.token  = this.userDetails.token;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {

    if(params['meetingId']){
        this.routeMeetingId   = params['meetingId'];
      }
    });
    
    if(this.roleId != '3'){
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
        // this.getMeetingStatus();
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }
    this.getdomainsettings();
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
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

  saveDomain(formData:NgForm){
    this.errorMsg   = "";
    if(formData.valid){
      var re            = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(formData.value.domain_email)){
          this.errorMsg   = 'Enter a valid email Id';
      }else{
        let params:any      = {};
        params.token        = this.token;
        params.admin_email  = formData.value.domain_email;
        params.domain_name  = formData.value.domain_name;
        params.domain_id    = this.domainId;

        this.domainSettingsService.save_domain_details(params)
              .subscribe(
              (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success == 1){
                  this.showSuccess('Saved successfully');
                  this.domainName  = response.body.domain_name;
                  this.domainEmail = response.body.admin_email;
                  this.domainId    = response.body.id;
                  
                }
              },
              (error) => {
                  error = JSON.parse(error['_body']);
                  if(error.message == "Login failed"){
                    this.user.logOut();
                    this.router.navigateByUrl('/');
                    this.showError(error.message);
                  }
              }
        );
      }
    }
  }

    // To read the files and performs file validation
  getFiles(event){
    if(event.target.files) {
      this.files                = event.target.files; 
      this.logo_image           = this.files;
      let upload_file_name      = this.logo_image[0].name;
      var allowedImgExtensions  = ["jpg","jpeg","png","JPG","JPEG"];
      this.fileExtension        = upload_file_name.split('.').pop();
      let check                 = allowedImgExtensions.filter(x => x == this.fileExtension);
      if(check.length !== 0){
          this.prof_pic_error = '';
          var reader = new FileReader();
          reader.onload       = (event) => {
          this.logo_img       = event.target['result'];
          this.user.logoUpdateEvent(this.logo_img);
          
        }
          
          reader.readAsDataURL(event.target.files[0]);
          this.upload_image_name        = upload_file_name;
          let formData:FormData         = new FormData();
          this.details.token            = this.token;
          formData.append('details', JSON.stringify(this.details));
          if(this.logo_image){
              formData.append('logo_image', this.logo_image[0]); 
          }
          this.domainSettingsService.UploadImage(formData)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.showSuccess('Logo updated successfully');
              this.logo_img               = response.body.logo_image_path;
              this.userDetails.logo_image = response.body.logo_image_path;
              this.domainId               =  response.body.id;
              this.user.putUser(this.userDetails);
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
          }
        );
          
      }else{
          this.prof_pic_error    = "Allowed image types are jpg | png | jpeg";
          this.logo_img          = "";
          this.upload_image_name = "";
      } 
         
    }
      
  }

  getdomainsettings(){
    let params:any = {};
    params.token   = this.token;
    this.domainSettingsService.getdomainsettings(params)
          .subscribe(
          (response:any) => {
            response   = JSON.parse(response['_body']);
            if(response.success == 1){
              this.domainName  = response.body.domain_name;
              this.domainEmail = response.body.admin_email;
              this.domainId    = response.body.id;
              this.logo_img    = response.body.logo_name;
            }
          },
          (error) => {
              error = JSON.parse(error['_body']);
              if(error.message == "Login failed"){
                this.user.logOut();
                this.router.navigateByUrl('/');
                this.showError(error.message);
              }
          }
    );
  }

}

