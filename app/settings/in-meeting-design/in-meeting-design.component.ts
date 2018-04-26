import { Component, OnInit , ViewContainerRef, ViewChild ,ElementRef, Input} from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from "app/shared/user";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ColorPickerService, Rgba } from 'ngx-color-picker';
import { Font } from 'ngx-font-picker';
import { InMeetingDesignService } from 'app/settings/in-meeting-design/in-meeting-design.service';
import { MESSAGE } from "app/shared/message";
declare var $:any;
@Component({
  selector: 'app-in-meeting-design',
  templateUrl: './in-meeting-design.component.html',
  styleUrls: ['./in-meeting-design.component.css'],
  providers:[InMeetingDesignService]
})
export class InMeetingDesignComponent implements OnInit {

  // Added - 16/11/2017
  @Input() routeMeetingId;
  @ViewChild('myFont') myFont: ElementRef;
  public userDetails;
  public token;
  public color_one: string = "#b7bcdd";
  public color_two: string = "#e43a3a";
  private _presetFonts = ['Arial', 'Serif', 'Helvetica', 'Sans-Serif', 'Open Sans', 'Roboto Slab'];
  public font: Font = new Font({
    family: 'Roboto',
    size: '14px',
    style: 'regular',
    styles: ['regular']
  });
  public sizeSelect: boolean  = false;
  public styleSelect: boolean = false;
  disableUploadBtn:boolean    = true;
  public uploaded_font        = "";
  public presetFonts          = this._presetFonts;
  files : FileList; 
  font_file: FileList;
  fileExtension               = "";
  font_error                  = "";
  fontFile                    = "";
  public theme                = 1;
  public pallet               = 1;
  public font_type            = 1;
  public data;
  public details:any          = {};
  public custom_font_family   = "";
  public preview_class        = "";
  public customFontError      = "";
  public defaultFontError     = "";
  public errCount             = 0;
  // Added - 16/11/2017
  public roleId;
  public urlPrefix = '';
  public accessDeniedDesign:boolean = false;
  public allDataFetchedDesign = false;
  public accessMessageDesign = '';

  constructor(private http:Http,private router:Router, private activatedRoute:ActivatedRoute,private cpService: ColorPickerService,private inMeetingDesignService:InMeetingDesignService,private user:User, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.userDetails   = user.getUser();
    this.token         = this.userDetails.token;
    this.toastr.setRootViewContainerRef(vcr);
    // Added - 16/11/2017
    this.roleId = this.userDetails.us_role_id;
    if(this.roleId == '1'){
      // Admin
      this.urlPrefix = '/admin';
    }else if(this.roleId == '2'){
      // Facilitator
      this.urlPrefix = '/facilitator';
    }
   }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!');
  }
  showError(msg) {
    this.toastr.error(msg, 'Failure!');
  }

  triggerFalseClick() {
    let el: HTMLElement = this.myFont.nativeElement as HTMLElement;
    el.click();
  }
  ngOnInit() {
    // Added - 16/11/2017
    if(this.roleId != '3'){
      if(this.routeMeetingId != '' && (!isNaN(this.routeMeetingId))){
      }else{
        this.router.navigateByUrl(this.urlPrefix + '/events-calendar');
      }
    }

    // Changed - 16/11/2017
    // let params = { 'token': this.token };
    let params = { 'token': this.token, 'route_meeting_id': this.routeMeetingId };
    this.inMeetingDesignService.getThemeDetails(params)
          .subscribe(
            (response:any) => {
              // Added - 29/11/2017
              this.allDataFetchedDesign = true;
              response   = JSON.parse(response['_body']);
              if(response.success == 1){
                //console.log(response)
                var designData = response.body;
                this.theme     = parseInt(designData.theme_id);
                this.pallet    = parseInt(designData.color_layout_type);
                if(this.pallet == 3){
                  var pallet_color        = designData.color_value;
                  var pallet_color_array  = pallet_color.split(',');
                  this.color_one          = pallet_color_array[0];
                  this.color_two          = pallet_color_array[1];
                }
                this.font_type = parseInt(designData.font_type);
                if(this.font_type == 1){
                  this.font.family        =  designData.font_family;
                  //this.triggerFalseClick();
                  this.disableUploadBtn = true;
                  this.preview_class = "";
                }else{
                  let font_name = designData.font_family;
                  let file_path = designData.custom_font;
                  this.preview_class = "preview-content";
                  $( "<style> @font-face { font-family: "+font_name+"; src: url('"+file_path+"'); }  .preview-content{ font-family: "+font_name+"; }</style>" ).appendTo( "head" )
                  this.uploaded_font    = font_name;
                  this.disableUploadBtn = false;
              }
              }
            },
            (error) => {
                error = JSON.parse(error['_body']);
                if(error.message == "Login failed"){
                  this.user.logOut();
                  this.showError(error.message);
                  // this.router.navigateByUrl('/');
                  // Added - 16/11/2017
                  this.redirectLogin();
                }else if (error.hasOwnProperty('status')) {
                  if(error.status == 'access_denied'){
                    this.accessDeniedDesign = true;
                    this.accessMessageDesign = MESSAGE.ACCESS_PERMISSION_DENIED;
                  }
                }
            }
         );
  }

  // fontClicked(){
  //   /*var e = $.Event('keyup');
  //   e.which = 65; 
  //   $('.search-field').trigger(e);*/
  //   $('.search-field').val('a')
  //   $('.search-field').trigger('keydown');
  // }
  getFiles(event,type){
      if(event.target.files) {
          this.files = event.target.files; 
          if(type == 'font'){ 
              this.font_file            = this.files;
              //console.log(this.font_file);
              let upload_file_name      = this.font_file[0].name;
              var allowedImgExtensions  = ["ttf","otf"];
              this.fileExtension        = upload_file_name.split('.').pop();
              let check                 = allowedImgExtensions.filter(x => x == this.fileExtension);
              if(check.length !== 0){
                  this.font_error    = '';
                  var reader         = new FileReader();
                  reader.onload      = (event) => {
                    this.fontFile    = event.target['result'];
                  }
                  reader.readAsDataURL(event.target.files[0]);
                  this.uploaded_font = upload_file_name;
                  
                  let font_name           = upload_file_name.substring(0, upload_file_name.indexOf('.'));
                  font_name               = font_name.replace(/[^\w\s]/gi, '');
                  this.custom_font_family = font_name;

                  let formData:FormData     = new FormData();
                  this.details.token        = this.token;
                  this.details.font_family  = font_name;
                  // Added - 16/11/2017
                  this.details.route_meeting_id = this.routeMeetingId;
                  formData.append('details', JSON.stringify(this.details));
                  formData.append('custom_font_file', this.font_file[0]); 

                  this.inMeetingDesignService.uploadFontFile(formData)
                    .subscribe(
                      (response:any) => {
                        response   = JSON.parse(response['_body']);
                        if(response.success == 1){
                          this.data = response.body;//console.log(this.data.custom_font_file)
                          let file_path = this.data.custom_font_file;
                          this.preview_class = "preview-content";
                          $( "<style> @font-face { font-family: "+font_name+"; src: url('"+file_path+"'); }  .preview-content{ font-family: "+font_name+"; }</style>" ).appendTo( "head" )
						              
                        }
                      },
                      (error) => {
                          error = JSON.parse(error['_body']);
                          if(error.message == "Login failed"){
                            this.user.logOut();
                            this.showError(error.message);
                            // this.router.navigateByUrl('/');
                            // Added - 16/11/2017
                            this.redirectLogin();
                          }
                      }
                    );
              }else{
                  this.fontFile      = "";
                  this.uploaded_font = "";
                  this.font_error    = "Allowed font file types are ttf | otf ";
              } 
              
          }
      }
        
  }

  onSubmit(event,meetingDesignInfo:NgForm){
      let theme_id    = meetingDesignInfo.value.theme;
      let layout_id   = meetingDesignInfo.value.pallet;
      let font_type   = meetingDesignInfo.value.font_type;
      let color_value = "";
      let font_family = "";
      this.defaultFontError ="";
      this.font_error = "";
      this.errCount   = 0;
      if(layout_id == 1){
         color_value = '#e91e63,#03a9f4';
      }else if(layout_id == 2){
         color_value = '#f44336,#ffc107';
      }else{
         color_value = this.color_one+','+this.color_two;
      }
      if(font_type == 1){
         if(this.font.family == ""){
           this.errCount++;
           this.defaultFontError = "Please choose a font family";
         }
         font_family = this.font.family;

      }else{
         if(this.custom_font_family == "" && this.uploaded_font == ""){
           this.errCount++;
           this.font_error = "Please upload a font file";
         }
         font_family = this.custom_font_family;
      }
        // Changed - 16/11/2017
      // let params = { 'token': this.token, 'theme_id':theme_id ,'color_layout_type':layout_id,'color_value':color_value, 'font_type':font_type ,'font_family' :font_family};
      let params = { 'token': this.token, 'theme_id':theme_id ,'color_layout_type':layout_id,'color_value':color_value, 'font_type':font_type ,'font_family' :font_family, 'route_meeting_id': this.routeMeetingId};
      if(this.errCount == 0){
          this.inMeetingDesignService.saveMeetingDesign(params)
            .subscribe(
              (response:any) => {
                response   = JSON.parse(response['_body']);
                if(response.success == 1){
                  this.showSuccess(response.message);
                  if(this.font_type == 1){
                    this.uploaded_font = "";
                  }
                }
              },
              (error) => {
                  error = JSON.parse(error['_body']);
                  if(error.message == "Login failed"){
                    this.user.logOut();
                    this.showError(error.message);
                    // this.router.navigateByUrl('/');
                    // Added - 16/11/2017
                    this.redirectLogin();
                  }
              }
            );     
      }
      
      //console.log(meetingDesignInfo.value)
      //console.log(this.font.family);
  }

  chooseFont(){
    this.disableUploadBtn = true;
    this.font_type        = 1;
    //this.triggerFalseClick();
    this.preview_class    = "";
    this.font_error       = "";
  }
  
  uploadFont(){
    this.disableUploadBtn = false;
    this.font_type        = 2;
  }

  themeSelection(theme_id){
    this.theme = theme_id;
  }

  palletSelection(pallet_id){
    this.pallet = pallet_id;
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
  


}
