import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Config } from 'app/config/config';
import { User } from 'app/shared/user';
import { ToastrService } from 'toastr-ng2';
import { MeetingDetailsService } from 'app/meeting-details/meeting-details.service';
import { StandBySettingsService } from 'app/meeting-details/stand-by-settings/stand-by-settings.service';

declare var $:any;
declare var google:any;
declare var map:any;

@Component({
  selector: 'app-stand-by-settings',
  templateUrl: './stand-by-settings.component.html',
  styleUrls: ['./stand-by-settings.component.css'],
  providers: [MeetingDetailsService, StandBySettingsService]
})

export class StandBySettingsComponent implements OnInit {

  public userDetails;
  public meetingId = '';
  public meetingStatus;
  public roleId;
  public urlPrefix = '';
  public routeMeetingId;
  public location_status = 1; // Disabled
  public content_type;
  files : FileList;
  public fileExists = 0;
  public imageFileError = 0;
  public imageFileName = '';
  public imagePath = Config.UPLOADS_PATH + 'standby_settings/';
  public uploadedFileName = '';
  public fileReq:boolean = false;
  public filesizeError = 0;
  public allDataFetched = false;
  public isRescheduled:boolean = false;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:User, private meetingDetailsService: MeetingDetailsService, private toastrService: ToastrService, private standBySettingsService: StandBySettingsService) { 
    this.userDetails   = user.getUser(); 
    this.roleId = this.userDetails.us_role_id;
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
      this.meetingId   = params['meetingId'];
      this.routeMeetingId = params['meetingId'];
    });
    this.getMeetingStatus();
    this.getStandBySettings();
  }

  /**
   * Get status of a meeting - Past, Future, Rescheduled
   */
  getMeetingStatus() {
    let params:any = {};
    params.meeting_id   = this.meetingId;
    params.token   = this.userDetails.token;
    this.meetingDetailsService.getStatus(params).subscribe(
      (response:any) => {
        response   = JSON.parse(response['_body']);
        if(response.success == 1){
          let meeting   = response.body.meeting;
          if(meeting.meeting_status == 3){
            this.meetingStatus = 1;
          }else{
            this.meetingStatus = 0;
            if(meeting.is_rescheduled){
              if(meeting.is_rescheduled == 1){
                this.isRescheduled = true;
              }
            }
          }
        }else{
          this.redirectHome();
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

  saveLocationStatus() {
    if(this.location_status == 0){ // Enable location
      // google.maps.event.addDomListener(window, 'load', this.initMap());
    }else{
      if(this.content_type == 1){
        this.content_type = 2;
      }
    }
  }

  /**
   * Custom file input change
   * @param event 
   */
  getFiles(event){ 
    if(event.target.files && event.target.files[0]) {
      this.fileReq = false;
      if((event.target.files[0].type == "image/png") || (event.target.files[0].type == "image/jpeg") || (event.target.files[0].type == "image/jpg") || (event.target.files[0].type == "image/gif")){
          this.files = event.target.files;
          this.fileExists = 1;
          let imageName = this.files[0].name;
          this.imageFileName = imageName;
          this.imageFileError = 0;
          this.validateSize(event.target);
      }else{
        this.imageFileError = 1;
        this.imageFileName = '';
      }
    }else{
      this.fileExists =0;
      this.imageFileError = 0;
      this.imageFileName = '';
      $("#customImage").value = "";
    }
  }

  /**
   * Save location settings
   * @param event 
   * @param settingsInfo 
   */
  saveStandBySettings(event, settingsInfo:NgForm) {
    let errors = 0;
    if(this.location_status == 0){ // Enable location
    }else{
      // Disable location
      if(this.content_type){
        // Changed - 17/04/2018
        // if((this.content_type != '') && (this.content_type != 1)){
        if((this.content_type != '')){
          if(this.content_type == 3){ // Custom image
            if(this.fileExists == 0){
              errors++;
              this.fileReq = true;
            }
            if(this.filesizeError == 1){
              errors++;
            }
          }
        }else{
          errors++;
        }
      }else{
        errors++;
      }
    }
    if((settingsInfo.valid) && (errors == 0)) {
      let formData:FormData = new FormData();
      let params:any = {};
      params.token = this.userDetails.token;
      params.meeting_id = this.meetingId;
      // Commented - 17/04/2018
      // let locStatus = 1; // Enabled
      // if(settingsInfo.value.location_status == 1){
      //   params.content_type = settingsInfo.value.content_type;
      //   locStatus = 2; // Disabled
      // }else{ // Enable location
      //   params.content_type = 1; // Map
      // }
      // params.location_status = locStatus;
      // Added - 17/04/2018
      params.content_type = settingsInfo.value.content_type;
      formData.append('details', JSON.stringify(params));
      if(this.files){
        formData.append('file', this.files[0]); 
      }
      // console.log(this.files);
      this.standBySettingsService.saveStandBySettings(formData).subscribe(
          (response:any) => {
            response = JSON.parse(response['_body']);
            if(response.success == 1){
              this.showSuccess(response.message);
              this.imageFileName = '';
              this.fileExists = 0;
              this.uploadedFileName = '';
              $('input[type="file"]').value = "";
              delete this.files;
              this.imageFileError = 0;
              this.fileReq = false;
              this.filesizeError = 0;
              if((this.content_type == 3) && (this.location_status == 1)){
                if(response.body.uploaded_file_name != ''){
                  this.uploadedFileName = response.body.uploaded_file_name;
                }
              } 
            }
          },
          (error) => { 
            error = JSON.parse(error['_body']);
            this.showFailure(error.message);
            if(error.message == 'Login failed'){
              this.user.logOut();
            }
          }
        );
    }
  }

  /**
   * Get location settings
   */
  getStandBySettings() {
    let params:any = {};
    params.meeting_id = this.meetingId;
    params.token = this.userDetails.token;
    this.standBySettingsService.getStandBySettings(params).subscribe(
      (response:any) => {
        this.allDataFetched = true;
        response = JSON.parse(response['_body']);
        if(response.success == 1){
          // Commented - 17/04/2018
          // this.location_status = response.body.location_status;
          this.content_type = parseInt(response.body.content_type);
          if(response.body.content_type == 3){ // Custom file
            if(response.body.content_details != ''){
              this.uploadedFileName = response.body.content_details;
            }
          }
        }
      },
      (error) => { 
        error = JSON.parse(error['_body']);
        this.showFailure(error.message);
        if(error.message == 'Login failed'){
          this.user.logOut();
        }
      }
    );
  }

  /**
   * Validate file size
   * @param file 
   */
  validateSize(file) {
    var fileSize = file.files[0].size / 1024 / 1024; // in MB
    if (fileSize > 2) {
      this.filesizeError = 1;
    } else {
      this.filesizeError = 0;
    }
  }

  /**
   * Show success toastr message
   * @param msg 
   */
  showSuccess(msg) {
    this.toastrService.success(msg, 'Success!');
  }

  /**
   * Show error toastr message
   * @param msg 
   */
  showFailure(msg) {
    this.toastrService.error(msg, 'Failure!');
  }

  /**
   * Redirects to login page based on user role
   */
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

  /**
   * Redirects to home page based on user role
   */
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

  initMap() {
      // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
      var mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng(8.558113, 76.881562), // Techno park
          streetViewControl: false,
          styles: [{
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#e9e9e9"
              }, {
                  "lightness": 17
              }]
          }, {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#f5f5f5"
              }, {
                  "lightness": 20
              }]
          }, {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [{
                  "color": "#ffffff"
              }, {
                  "lightness": 17
              }]
          }, {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{
                  "color": "#ffffff"
              }, {
                  "lightness": 29
              }, {
                  "weight": 0.2
              }]
          }, {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#ffffff"
              }, {
                  "lightness": 18
              }]
          }, {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#e5e5e5"
              }, {
                  "lightness": 16
              }]
          }, {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#f5f5f5"
              }, {
                  "lightness": 21
              }]
          }, {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#dedede"
              }, {
                  "lightness": 21
              }]
          }, {
              "elementType": "labels.text.stroke",
              "stylers": [{
                  "visibility": "on"
              }, {
                  "color": "#ffffff"
              }, {
                  "lightness": 16
              }]
          }, {
              "elementType": "labels.text.fill",
              "stylers": [{
                  "saturation": 36
              }, {
                  "color": "#333333"
              }, {
                  "lightness": 40
              }]
          }, {
              "elementType": "labels.icon",
              "stylers": [{
                  "visibility": "off"
              }]
          }, {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#f2f2f2"
              }, {
                  "lightness": 19
              }]
          }, {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [{
                  "color": "#fefefe"
              }, {
                  "lightness": 20
              }]
          }, {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [{
                  "color": "#fefefe"
              }, {
                  "lightness": 17
              }, {
                  "weight": 1.2
              }]
          }]
      };
      // Get the HTML DOM element that will contain your map           
      var mapElement = document.getElementById('map');
      // Create the Google Map using our element and options defined above
      var map = new google.maps.Map(mapElement, mapOptions);
      // Let's also add a marker while we're at it
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(8.558113, 76.881562),
          map: map,
          title: 'TokBird!',

      });
      var icon = {
          anchor: new google.maps.Point(25, 50),
          scaledSize: new google.maps.Size(100, 100)

      };
      marker.setIcon('assets/images/marker.svg');
  }

}
